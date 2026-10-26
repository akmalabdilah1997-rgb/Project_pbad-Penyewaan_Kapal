const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

/* =============== READ (all) =============== */
const findAllPasien = async () => {
  return await dbAll('SELECT * FROM pasien ORDER BY id_pasien DESC');
};

/* =============== READ (by id) =============== */
const findPasienById = async (id) => {
  return await dbGet('SELECT * FROM pasien WHERE id_pasien = ?', [id]);
};

/* =============== CREATE =============== */
const createPasien = async (body) => {
  const query = `
    INSERT INTO pasien (nama_pasien, nomor_telepon, tanggal_lahir, riwayat_singkat)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    body.nama_pasien,
    body.nomor_telepon ?? null,
    body.tanggal_lahir ?? null,
    body.riwayat_singkat ?? null,
  ];

  const { lastID } = await dbRun(query, values);
  return await findPasienById(lastID);
};

/* =============== UPDATE =============== */
const updatePasien = async (id, body) => {
  const existing = await findPasienById(id);
  if (!existing) return null;

  const query = `
    UPDATE pasien
    SET nama_pasien = ?, nomor_telepon = ?, tanggal_lahir = ?, riwayat_singkat = ?
    WHERE id_pasien = ?
  `;
  const values = [
    body.nama_pasien ?? existing.nama_pasien,
    body.nomor_telepon ?? existing.nomor_telepon,
    body.tanggal_lahir ?? existing.tanggal_lahir,
    body.riwayat_singkat ?? existing.riwayat_singkat,
    id,
  ];

  await dbRun(query, values);
  return await findPasienById(id);
};

/* =============== DELETE =============== */
const deletePasien = async (id) => {
  const { changes } = await dbRun('DELETE FROM pasien WHERE id_pasien = ?', [id]);
  return changes > 0;
};

const bulkCreatePasien = async (pasienList) => {
  await dbRun('BEGIN TRANSACTION');

  try {
    const createdPasien = [];

    for (const pasien of pasienList) {
      const result = await dbRun(
        `INSERT INTO pasien
          (nama_pasien, nomor_telepon, tanggal_lahir, riwayat_singkat)
         VALUES (?, ?, ?, ?)`,
        [
          pasien.nama_pasien,
          pasien.nomor_telepon ?? null,
          pasien.tanggal_lahir ?? null,
          pasien.riwayat_singkat ?? null,
        ]
      );

      createdPasien.push({
        id_pasien: result.lastID,
        ...pasien,
      });
    }

    await dbRun('COMMIT');

    return createdPasien;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

module.exports = {
  findAllPasien,
  findPasienById,
  createPasien,
  updatePasien,
  deletePasien,
  bulkCreatePasien
};