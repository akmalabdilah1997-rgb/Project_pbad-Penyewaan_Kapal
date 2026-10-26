const jadwalTemuModel = require('../models/jadwalTemuModel');

const success = (res, code, message, data = null) => res.status(code).json({ success: true, message, data });
const fail = (res, code, message, error = null) => res.status(code).json({ success: false, message, error });

const getAllJadwal = async (req, res) => {
  try {
    const jadwal = await jadwalTemuModel.findAllJadwal();
    success(res, 200, 'Berhasil mengambil semua jadwal', jadwal);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const getJadwalById = async (req, res) => {
  try {
    const jadwal = await jadwalTemuModel.findJadwalById(req.params.id);
    if (!jadwal) return fail(res, 404, 'Jadwal tidak ditemukan');
    success(res, 200, 'Berhasil mengambil data jadwal', jadwal);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const createJadwal = async (req, res) => {
  try {
    const { id_pasien, id_dokter, tanggal_kunjungan, jam_sesi } = req.body;
    if (!id_pasien || !id_dokter || !tanggal_kunjungan || !jam_sesi) {
      return fail(res, 400, 'Validasi gagal', 'id_pasien, id_dokter, tanggal_kunjungan, dan jam_sesi wajib diisi');
    }

    const created = await jadwalTemuModel.createJadwal(req.body);
    success(res, 201, 'Jadwal berhasil dibuat', created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const updateJadwal = async (req, res) => {
  try {
    const updated = await jadwalTemuModel.updateJadwal(req.params.id, req.body);
    if (!updated) return fail(res, 404, 'Jadwal tidak ditemukan');
    success(res, 200, 'Jadwal berhasil diupdate', updated);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const deleteJadwal = async (req, res) => {
  try {
    const deleted = await jadwalTemuModel.deleteJadwal(req.params.id);
    if (!deleted) return fail(res, 404, 'Jadwal tidak ditemukan');
    success(res, 200, 'Jadwal berhasil dihapus');
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

const bulkCreateJadwal = async (req, res) => {
  try {
    const { jadwal } = req.body;
    if (!Array.isArray(jadwal) || jadwal.length === 0) return fail(res, 400, 'Validasi gagal', 'Data jadwal harus array');

    for (const [index, j] of jadwal.entries()) {
     
if (!j.id_pasien || !j.id_dokter || !j.tanggal_kunjungan) {
  return res.status(400).json({ success: false, message: "Validasi gagal", error: "data wajib (id_pasien, id_dokter, tanggal_kunjungan) harus diisi" });
}
    }
    const created = await jadwalTemuModel.bulkCreateJadwal(jadwal);
    success(res, 201, `${created.length} jadwal berhasil dibuat`, created);
  } catch (error) {
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = { getAllJadwal, getJadwalById, createJadwal, updateJadwal, deleteJadwal, bulkCreateJadwal };