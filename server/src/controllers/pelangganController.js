const pelangganModel = require('../models/pelangganModel');

/* =========================================================
 *  Helper: standard response biar konsisten
 * ========================================================= */
const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

/* =========================================================
 *  GET /api/pelanggan — semua pelanggan
 * ========================================================= */
const getAllPelanggan = async (req, res) => {
  try {
    const pelanggan = await pelangganModel.findAllPelanggan();
    success(res, 200, 'Berhasil mengambil semua data pelanggan', pelanggan);
  } catch (error) {
    console.error('[getAllPelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/pelanggan/:id — satu pelanggan
 * ========================================================= */
const getPelangganById = async (req, res) => {
  try {
    const pelanggan = await pelangganModel.findPelangganById(req.params.id);
    if (!pelanggan) return fail(res, 404, 'Pelanggan tidak ditemukan');
    success(res, 200, 'Berhasil mengambil data pelanggan', pelanggan);
  } catch (error) {
    console.error('[getPelangganById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/pelanggan — buat pelanggan baru
 * ========================================================= */
const createPelanggan = async (req, res) => {
  try {
    const { nama_pelanggan } = req.body;

    // Validasi wajib
    if (!nama_pelanggan || nama_pelanggan.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'nama_pelanggan wajib diisi');
    }

    const created = await pelangganModel.createPelanggan(req.body);
    success(res, 201, 'Data pelanggan berhasil dibuat', created);
  } catch (error) {
    console.error('[createPelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT /api/pelanggan/:id — update pelanggan
 * ========================================================= */
const updatePelanggan = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await pelangganModel.updatePelanggan(id, req.body);
    if (!updated) return fail(res, 404, 'Pelanggan tidak ditemukan');

    success(res, 200, 'Data pelanggan berhasil diupdate', updated);
  } catch (error) {
    console.error('[updatePelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/pelanggan/:id — hapus pelanggan
 * ========================================================= */
const deletePelanggan = async (req, res) => {
  try {
    const deleted = await pelangganModel.deletePelanggan(req.params.id);
    if (!deleted) return fail(res, 404, 'Pelanggan tidak ditemukan');

    success(res, 200, 'Data pelanggan berhasil dihapus');
  } catch (error) {
    console.error('[deletePelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/pelanggan/bulk — buat banyak pelanggan sekaligus
 * ========================================================= */
const bulkCreatePelanggan = async (req, res) => {
  try {
    const { pelanggan } = req.body;

    if (!Array.isArray(pelanggan) || pelanggan.length === 0) {
      return fail(
        res,
        400,
        'Validasi gagal',
        'pelanggan harus berupa array yang tidak kosong'
      );
    }

    for (const [index, p] of pelanggan.entries()) {
      if (
        !p ||
        typeof p.nama_pelanggan !== 'string' ||
        p.nama_pelanggan.trim() === ''
      ) {
        return fail(
          res,
          400,
          'Validasi gagal',
          `pelanggan[${index}].nama_pelanggan wajib diisi`
        );
      }
    }

    const created = await pelangganModel.bulkCreatePelanggan(pelanggan);

    success(
      res,
      201,
      `${created.length} data pelanggan berhasil dibuat`,
      created
    );
  } catch (error) {
    console.error('[bulkCreatePelanggan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllPelanggan,
  getPelangganById,
  createPelanggan,
  updatePelanggan,
  deletePelanggan,
  bulkCreatePelanggan
};