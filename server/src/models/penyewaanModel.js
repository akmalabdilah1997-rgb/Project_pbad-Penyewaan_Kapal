const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllPenyewaan = async () => {
  const query = `
    SELECT 
      p.*, 
      pel.nama_pelanggan, 
      pel.no_hp, 
      k.nama_kapal 
    FROM penyewaan p
    JOIN pelanggan pel ON p.id_pelanggan = pel.id_pelanggan
    JOIN kapal k ON p.id_kapal = k.id_kapal
    ORDER BY p.id_sewa DESC
  `;
  return await dbAll(query);
};


const findPenyewaanById = async (id) => {
  const query = `
    SELECT 
      p.*, 
      pel.nama_pelanggan, 
      pel.no_hp, 
      k.nama_kapal 
    FROM penyewaan p
    JOIN pelanggan pel ON p.id_pelanggan = pel.id_pelanggan
    JOIN kapal k ON p.id_kapal = k.id_kapal
    WHERE p.id_sewa = ?
  `;
  return await dbGet(query, [id]);
};

const createPenyewaan = async (body) => {
  const query = `
    INSERT INTO penyewaan (id_pelanggan, id_kapal, tanggal_sewa, tanggal_pengembalian, status_pesanan, catatan)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.id_pelanggan,
    body.id_kapal,
    body.tanggal_sewa,
    body.tanggal_pengembalian,
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
    SET id_pelanggan = ?, id_kapal = ?, tanggal_sewa = ?, tanggal_pengembalian = ?, status_pesanan = ?, catatan = ?
    WHERE id_sewa = ?
  `;
  const values = [
    body.id_pelanggan ?? existing.id_pelanggan,
    body.id_kapal ?? existing.id_kapal,
    body.tanggal_sewa ?? existing.tanggal_sewa,
    body.tanggal_pengembalian ?? existing.tanggal_pengembalian,
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
        `INSERT INTO penyewaan (id_pelanggan, id_kapal, tanggal_sewa, tanggal_pengembalian, status_pesanan, catatan) VALUES (?, ?, ?, ?, ?, ?)`,
        [p.id_pelanggan, p.id_kapal, p.tanggal_sewa, p.tanggal_pengembalian, p.status_pesanan ?? 'Menunggu ACC', p.catatan ?? null]
      );
      createdPenyewaan.push(await findPenyewaanById(result.lastID)); 
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