const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllPenyewaan = async () => {
  return await dbAll('SELECT * FROM penyewaan ORDER BY id_sewa DESC');
};

const findPenyewaanById = async (id) => {
  return await dbGet('SELECT * FROM penyewaan WHERE id_sewa = ?', [id]);
};

const createPenyewaan = async (body) => {
  const query = `
    INSERT INTO penyewaan (id_pelanggan, id_kapal, tanggal_sewa, status_pesanan, catatan)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    body.id_pelanggan,
    body.id_kapal,
    body.tanggal_sewa,
    body.status_pesanan ?? 'Menunggu ACC',
    body.catatan ?? null,
  ];

  const { lastID } = await dbRun(query, values);
  return await findPenyewaanById(lastID);
};

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
    body.catatan !== undefined ? body.catatan : existing.catatan,
    id,
  ];

  await dbRun(query, values);
  return await findPenyewaanById(id);
};

const deletePenyewaan = async (id) => {
  const { changes } = await dbRun('DELETE FROM penyewaan WHERE id_sewa = ?', [id]);
  return changes > 0;
};

const bulkCreatePenyewaan = async (penyewaanList) => {
  await dbRun('BEGIN TRANSACTION');
  try {
    const createdPenyewaan = [];
    for (const p of penyewaanList) {
      const result = await dbRun(
        `INSERT INTO penyewaan (id_pelanggan, id_kapal, tanggal_sewa, status_pesanan, catatan) VALUES (?, ?, ?, ?, ?)`,
        [p.id_pelanggan, p.id_kapal, p.tanggal_sewa, p.status_pesanan ?? 'Menunggu ACC', p.catatan ?? null]
      );
      createdPenyewaan.push({ id_sewa: result.lastID, ...p });
    }
    await dbRun('COMMIT');
    return createdPenyewaan;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

module.exports = {
  findAllPenyewaan, findPenyewaanById, createPenyewaan, updatePenyewaan, deletePenyewaan, bulkCreatePenyewaan
};