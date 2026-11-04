const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

/* =============== READ (all) =============== */
const findAllPenyewaan = async () => {
  return await dbAll('SELECT * FROM penyewaan ORDER BY id_sewa DESC');
};

/* =============== READ (by id) =============== */
const findPenyewaanById = async (id) => {
  return await dbGet('SELECT * FROM penyewaan WHERE id_sewa = ?', [id]);
};

/* =============== CREATE =============== */
const createPenyewaan = async (body) => {
  const query = `
    INSERT INTO penyewaan (id_pelanggan, id_kapal, tanggal_sewa, status_pesanan, catatan)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    body.id_pelanggan,
    body.id_kapal,
    body.tanggal_sewa,
    body.status_pesanan || 'Menunggu ACC', // Default status 
    body.catatan ?? null,
  ];

  const { lastID } = await dbRun(query, values);
  return await findPenyewaanById(lastID);
};

/* =============== UPDATE =============== */
const updatePenyewaan = async (id, body) => {
  const existing = await findPenyewaanById(id);
  if (!existing) return null;

  const query = `
    UPDATE penyewaan
    SET id_pelanggan = ?, id_kapal = ?, tanggal_sewa = ?, status_pesanan = ?, catatan = ?
    WHERE id_sewa = ?
  `;
  const values = [
    body.id_pelanggan ?? existing.id_pelanggan,
    body.id_kapal ?? existing.id_kapal,
    body.tanggal_sewa ?? existing.tanggal_sewa,
    body.status_pesanan ?? existing.status_pesanan,
    body.catatan ?? existing.catatan,
    id,
  ];

  await dbRun(query, values);
  return await findPenyewaanById(id);
};

/* =============== DELETE =============== */
const deletePenyewaan = async (id) => {
  const { changes } = await dbRun('DELETE FROM penyewaan WHERE id_sewa = ?', [id]);
  return changes > 0;
};

/* =============== BULK CREATE =============== */
const bulkCreatePenyewaan = async (penyewaanList) => {
  await dbRun('BEGIN TRANSACTION');

  try {
    const createdPenyewaan = [];

    for (const item of penyewaanList) {
      const result = await dbRun(
        `INSERT INTO penyewaan
          (id_pelanggan, id_kapal, tanggal_sewa, status_pesanan, catatan)
         VALUES (?, ?, ?, ?, ?)`,
        [
          item.id_pelanggan,
          item.id_kapal,
          item.tanggal_sewa,
          item.status_pesanan || 'Menunggu ACC',
          item.catatan ?? null,
        ]
      );

      createdPenyewaan.push({
        id_sewa: result.lastID,
        ...item,
      });
    }

    await dbRun('COMMIT');

    return createdPenyewaan;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

module.exports = {
  findAllPenyewaan,
  findPenyewaanById,
  createPenyewaan,
  updatePenyewaan,
  deletePenyewaan,
  bulkCreatePenyewaan
};