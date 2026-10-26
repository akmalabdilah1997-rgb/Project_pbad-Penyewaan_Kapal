const dokterModel = require('../models/dokterModel');

const success = (res, code, message, data = null) => res.status(code).json({ success: true, message, data });
const fail = (res, code, message, error = null) => res.status(code).json({ success: false, message, error });

const getAllDokter = async (req, res) => {
  try {
    const dokter = await dokterModel.findAllDokter();
    success(res, 200, 'Berhasil mengambil semua data dokter', dokter);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const getDokterById = async (req, res) => {
  try {
    const dokter = await dokterModel.findDokterById(req.params.id);
    if (!dokter) return fail(res, 404, 'Dokter tidak ditemukan');
    success(res, 200, 'Berhasil mengambil data dokter', dokter);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const createDokter = async (req, res) => {
  try {
    const { nama_dokter, spesialisasi } = req.body;
    if (!nama_dokter || nama_dokter.trim() === '') return fail(res, 400, 'Validasi gagal', 'nama_dokter wajib diisi');
    if (!spesialisasi || spesialisasi.trim() === '') return fail(res, 400, 'Validasi gagal', 'spesialisasi wajib diisi');

    const created = await dokterModel.createDokter(req.body);
    success(res, 201, 'Data dokter berhasil dibuat', created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const updateDokter = async (req, res) => {
  try {
    const updated = await dokterModel.updateDokter(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Dokter tidak ditemukan');
    success(res, 200, 'Data dokter berhasil diupdate', updated);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const deleteDokter = async (req, res) => {
  try {
    const deleted = await dokterModel.deleteDokter(req.params.id);
    if (!deleted) return fail(res, 404, 'Dokter tidak ditemukan');
    success(res, 200, 'Data dokter berhasil dihapus');
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const bulkCreateDokter = async (req, res) => {
  try {
    const { dokter } = req.body;
    if (!Array.isArray(dokter) || dokter.length === 0) return fail(res, 400, 'Validasi gagal', 'Data dokter harus array');

    for (const [index, d] of dokter.entries()) {
      if (!d || !d.nama_dokter || !d.spesialisasi) {
        return fail(res, 400, 'Validasi gagal', `dokter[${index}] nama dan spesialisasi wajib diisi`);
      }
    }
    const created = await dokterModel.bulkCreateDokter(dokter);
    success(res, 201, `${created.length} data dokter berhasil dibuat`, created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { getAllDokter, getDokterById, createDokter, updateDokter, deleteDokter, bulkCreateDokter };