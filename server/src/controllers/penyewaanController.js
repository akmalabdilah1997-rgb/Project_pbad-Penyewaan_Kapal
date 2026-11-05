const penyewaanModel = require('../models/penyewaanModel');
const { dbGet, dbRun } = require('../middlewares_helpers/sqlite3_helpers'); 

const success = (res, code, message, data = null) => res.status(code).json({ success: true, message, data });
const fail = (res, code, message, error = null) => res.status(code).json({ success: false, message, error });

const getAllPenyewaan = async (req, res) => {
  try {
    const penyewaan = await penyewaanModel.findAllPenyewaan();
    success(res, 200, 'Berhasil mengambil semua data penyewaan', penyewaan);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const getPenyewaanById = async (req, res) => {
  try {
    const penyewaan = await penyewaanModel.findPenyewaanById(req.params.id);
    if (!penyewaan) return fail(res, 404, 'Penyewaan tidak ditemukan');
    success(res, 200, 'Berhasil mengambil data penyewaan', penyewaan);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const createPenyewaan = async (req, res) => {
  try {
    const { id_pelanggan, id_kapal, tanggal_sewa, tanggal_pengembalian } = req.body;
    
    if (!id_pelanggan || !id_kapal || !tanggal_sewa || !tanggal_pengembalian) {
      return fail(res, 400, 'Validasi gagal', 'id_pelanggan, id_kapal, tanggal_sewa, dan tanggal_pengembalian wajib diisi');
    }

    const kapal = await dbGet('SELECT * FROM kapal WHERE id_kapal = ?', [id_kapal]);
    if (!kapal) {
      return fail(res, 404, 'Gagal memesan', 'Kapal tidak ditemukan di database.');
    }
    
    if (kapal.status_kapal !== 'Tersedia') {
      return fail(res, 400, 'Gagal memesan', `Maaf, kapal ini sedang berstatus '${kapal.status_kapal}' dan tidak bisa disewa saat ini.`);
    }

    const created = await penyewaanModel.createPenyewaan(req.body);
    success(res, 201, 'Data penyewaan berhasil dibuat', created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const updatePenyewaan = async (req, res) => {
  try {
    const id_sewa = req.params.id;
    const { status_pesanan } = req.body;

    const existingSewa = await penyewaanModel.findPenyewaanById(id_sewa);
    if (!existingSewa) return fail(res, 404, 'Penyewaan tidak ditemukan');

    const updated = await penyewaanModel.updatePenyewaan(id_sewa, req.body);

    if (status_pesanan === 'Sedang Disewa') {
      const catatanBaru = `Sedang disewa oleh ${existingSewa.nama_pelanggan} dari ${existingSewa.tanggal_sewa} s/d ${existingSewa.tanggal_pengembalian}`;
      await dbRun('UPDATE kapal SET status_kapal = ?, catatan = ? WHERE id_kapal = ?', ['Tidak Tersedia', catatanBaru, existingSewa.id_kapal]);
    
    } else if (status_pesanan === 'Selesai' || status_pesanan === 'Batal') {
      await dbRun('UPDATE kapal SET status_kapal = ?, catatan = ? WHERE id_kapal = ?', ['Tersedia', '-', existingSewa.id_kapal]);
    }

    success(res, 200, 'Data penyewaan berhasil diupdate & Status kapal otomatis disesuaikan', updated);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const deletePenyewaan = async (req, res) => {
  try {
    const deleted = await penyewaanModel.deletePenyewaan(req.params.id);
    if (!deleted) return fail(res, 404, 'Penyewaan tidak ditemukan');
    success(res, 200, 'Data penyewaan berhasil dihapus');
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const bulkCreatePenyewaan = async (req, res) => {
  try {
    const { penyewaan } = req.body;
    if (!Array.isArray(penyewaan) || penyewaan.length === 0) return fail(res, 400, 'Validasi gagal', 'Data penyewaan harus array');

    for (const [index, p] of penyewaan.entries()) {
      if (!p.id_pelanggan || !p.id_kapal || !p.tanggal_sewa || !p.tanggal_pengembalian) {
        return res.status(400).json({ success: false, message: "Validasi gagal", error: "data wajib (id_pelanggan, id_kapal, tanggal_sewa, tanggal_pengembalian) harus diisi" });
      }
      
      const kapal = await dbGet('SELECT * FROM kapal WHERE id_kapal = ?', [p.id_kapal]);
      if (!kapal || kapal.status_kapal !== 'Tersedia') {
         return fail(res, 400, 'Gagal memproses bulk', `Kapal ID ${p.id_kapal} tidak tersedia. Seluruh proses dibatalkan.`);
      }
    }
    
    const created = await penyewaanModel.bulkCreatePenyewaan(penyewaan);
    success(res, 201, `${created.length} data penyewaan berhasil dibuat`, created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { 
  getAllPenyewaan, 
  getPenyewaanById, 
  createPenyewaan, 
  updatePenyewaan, 
  deletePenyewaan, 
  bulkCreatePenyewaan 
};