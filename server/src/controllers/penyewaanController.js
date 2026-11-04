const penyewaanModel = require('../models/penyewaanModel');

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
    const { id_pelanggan, id_kapal, tanggal_sewa } = req.body;
    
    if (!id_pelanggan || !id_kapal || !tanggal_sewa) {
      return fail(res, 400, 'Validasi gagal', 'id_pelanggan, id_kapal, dan tanggal_sewa wajib diisi');
    }

    const created = await penyewaanModel.createPenyewaan(req.body);
    success(res, 201, 'Data penyewaan berhasil dibuat', created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const updatePenyewaan = async (req, res) => {
  try {
    const updated = await penyewaanModel.updatePenyewaan(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Penyewaan tidak ditemukan');
    success(res, 200, 'Data penyewaan berhasil diupdate', updated);
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
      if (!p.id_pelanggan || !p.id_kapal || !p.tanggal_sewa) {
        return res.status(400).json({ success: false, message: "Validasi gagal", error: "data wajib (id_pelanggan, id_kapal, tanggal_sewa) harus diisi" });
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