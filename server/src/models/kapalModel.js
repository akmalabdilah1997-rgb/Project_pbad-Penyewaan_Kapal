const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllKapal = async () => {
  return await dbAll('SELECT * FROM kapal');
};

const findKapalById = async (id) => {
  return await dbGet('SELECT * FROM kapal WHERE id_kapal = ?', [id]);
};

const createKapal = async (body) => {
  const query = `
    INSERT INTO kapal (nama_kapal, merek, jenis, harga_sewa, status_kapal, catatan)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.nama_kapal, 
    body.merek ?? null,
    body.jenis ?? null,
    body.harga_sewa,
    body.status_kapal ?? 'Tersedia',
    body.catatan ?? null
  ];

  const { lastID } = await dbRun(query, values);
  return await findKapalById(lastID);
};

const updateKapal = async (id, body) => {
  const existing = await findKapalById(id);
  if (!existing) return null;

  const query = `
    UPDATE kapal
    SET nama_kapal = ?, merek = ?, jenis = ?, harga_sewa = ?, status_kapal = ?, catatan = ?
    WHERE id_kapal = ?
  `;
  const values = [
    body.nama_kapal ?? existing.nama_kapal,
    body.merek ?? existing.merek,
    body.jenis ?? existing.jenis,
    body.harga_sewa ?? existing.harga_sewa,
    body.status_kapal ?? existing.status_kapal,
    body.catatan !== undefined ? body.catatan : existing.catatan, // bisa dikosongkan
    id,
  ];

  await dbRun(query, values);
  return await findKapalById(id);
};

const deleteKapal = async (id) => {
  const { changes } = await dbRun('DELETE FROM kapal WHERE id_kapal = ?', [id]);
  return changes > 0;
};

const bulkCreateKapal = async (kapalList) => {
  await dbRun('BEGIN TRANSACTION');
  try {
    const createdKapal = [];
    for (const k of kapalList) {
      const result = await dbRun(
        `INSERT INTO kapal (nama_kapal, merek, jenis, harga_sewa, status_kapal, catatan) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          k.nama_kapal, 
          k.merek ?? null, 
          k.jenis ?? null, 
          k.harga_sewa, 
          k.status_kapal ?? 'Tersedia', 
          k.catatan ?? null
        ]
      );
      createdKapal.push({ id_kapal: result.lastID, ...k });
    }
    await dbRun('COMMIT');
    return createdKapal;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

module.exports = { findAllKapal, findKapalById, createKapal, updateKapal, deleteKapal, bulkCreateKapal };