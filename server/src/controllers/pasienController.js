const productModel = require('../models/pasienModel');

/* =========================================================
 *  Helper: standard response biar konsisten
 * ========================================================= */
const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

/* =========================================================
 *  GET /api/pasien — semua pasien
 * ========================================================= */
const getAllPasien = async (req, res) => {
  try {
    const pasien = await productModel.findAllPasien();
    success(res, 200, 'Berhasil mengambil semua data pasien', pasien);
  } catch (error) {
    console.error('[getAllPasien]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/pasien/:id — satu pasien
 * ========================================================= */
const getPasienById = async (req, res) => {
  try {
    const pasien = await productModel.findPasienById(req.params.id);
    if (!pasien) return fail(res, 404, 'Pasien tidak ditemukan');
    success(res, 200, 'Berhasil mengambil data pasien', pasien);
  } catch (error) {
    console.error('[getPasienById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/pasien — buat pasien baru
 * ========================================================= */
const createPasien = async (req, res) => {
  try {
    const { nama_pasien } = req.body;

    // Validasi wajib
    if (!nama_pasien || nama_pasien.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'nama_pasien wajib diisi');
    }

    const created = await productModel.createPasien(req.body);
    success(res, 201, 'Data pasien berhasil dibuat', created);
  } catch (error) {
    console.error('[createPasien]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT /api/pasien/:id — update pasien
 * ========================================================= */
const updatePasien = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await productModel.updatePasien(id, req.body);
    if (!updated) return fail(res, 404, 'Pasien tidak ditemukan');

    success(res, 200, 'Data pasien berhasil diupdate', updated);
  } catch (error) {
    console.error('[updatePasien]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/pasien/:id — hapus pasien
 * ========================================================= */
const deletePasien = async (req, res) => {
  try {
    const deleted = await productModel.deletePasien(req.params.id);
    if (!deleted) return fail(res, 404, 'Pasien tidak ditemukan');

    success(res, 200, 'Data pasien berhasil dihapus');
  } catch (error) {
    console.error('[deletePasien]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

const bulkCreatePasien = async (req, res) => {
  try {
    const { pasien } = req.body;

    if (!Array.isArray(pasien) || pasien.length === 0) {
      return fail(
        res,
        400,
        'Validasi gagal',
        'pasien harus berupa array yang tidak kosong'
      );
    }

    for (const [index, p] of pasien.entries()) {
      if (
        !p ||
        typeof p.nama_pasien !== 'string' ||
        p.nama_pasien.trim() === ''
      ) {
        return fail(
          res,
          400,
          'Validasi gagal',
          `pasien[${index}].nama_pasien wajib diisi`
        );
      }
    }

    const created = await productModel.bulkCreatePasien(pasien);

    success(
      res,
      201,
      `${created.length} data pasien berhasil dibuat`,
      created
    );
  } catch (error) {
    console.error('[bulkCreatePasien]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  bulkCreatePasien
};