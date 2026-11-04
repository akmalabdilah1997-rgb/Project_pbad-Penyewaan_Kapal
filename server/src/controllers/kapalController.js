const kapalModel = require('../models/kapalModel');

const success = (res, code, message, data = null) => res.status(code).json({ success: true, message, data });
const fail = (res, code, message, error = null) => res.status(code).json({ success: false, message, error });

const getAllKapal = async (req, res) => {
  try {
    const kapal = await kapalModel.findAllKapal();
    success(res, 200, 'Berhasil mengambil semua data kapal', kapal);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const getKapalById = async (req, res) => {
  try {
    const kapal = await kapalModel.findKapalById(req.params.id);
    if (!kapal) return fail(res, 404, 'Kapal tidak ditemukan');
    success(res, 200, 'Berhasil mengambil data kapal', kapal);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const createKapal = async (req, res) => {
  try {
    const { nama_kapal, harga_sewa } = req.body;
    
    // Validasi wajib untuk kapal baru
    if (!nama_kapal || nama_kapal.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'nama_kapal wajib diisi');
    }
    if (!harga_sewa) {
      return fail(res, 400, 'Validasi gagal', 'harga_sewa wajib diisi');
    }

    const created = await kapalModel.createKapal(req.body);
    success(res, 201, 'Data kapal berhasil dibuat', created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const updateKapal = async (req, res) => {
  try {
    const updated = await kapalModel.updateKapal(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Kapal tidak ditemukan');
    success(res, 200, 'Data kapal berhasil diupdate', updated);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const deleteKapal = async (req, res) => {
  try {
    const deleted = await kapalModel.deleteKapal(req.params.id);
    if (!deleted) return fail(res, 404, 'Kapal tidak ditemukan');
    success(res, 200, 'Data kapal berhasil dihapus');
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const bulkCreateKapal = async (req, res) => {
  try {
    const { kapal } = req.body;
    if (!Array.isArray(kapal) || kapal.length === 0) {
      return fail(res, 400, 'Validasi gagal', 'Data kapal harus array dan tidak kosong');
    }

    for (const [index, k] of kapal.entries()) {
      if (!k.nama_kapal || k.nama_kapal.trim() === '' || !k.harga_sewa) {
        return fail(res, 400, 'Validasi gagal', `kapal[${index}] nama_kapal dan harga_sewa wajib diisi`);
      }
    }
    
    const created = await kapalModel.bulkCreateKapal(kapal);
    success(res, 201, `${created.length} data kapal berhasil dibuat`, created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { getAllKapal, getKapalById, createKapal, updateKapal, deleteKapal, bulkCreateKapal };