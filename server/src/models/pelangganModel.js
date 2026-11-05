const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

/* =============== READ (all) =============== */
const findAllPelanggan = async () => {
  return await dbAll('SELECT * FROM pelanggan ORDER BY id_pelanggan DESC');
};

/* =============== READ (by id) =============== */
const findPelangganById = async (id) => {
  return await dbGet('SELECT * FROM pelanggan WHERE id_pelanggan = ?', [id]);
};

/* =============== CREATE =============== */
const createPelanggan = async (body) => {
  const query = `INSERT INTO pelanggan (nama_pelanggan, no_hp) VALUES (?, ?)`;
  const values = [body.nama_pelanggan, body.no_hp];
  
  const { lastID } = await dbRun(query, values);
  return await findPelangganById(lastID);
};

/* =============== UPDATE =============== */
const updatePelanggan = async (id, body) => {
  const existing = await findPelangganById(id);
  if (!existing) return null;

  const query = `UPDATE pelanggan SET nama_pelanggan = ?, no_hp = ? WHERE id_pelanggan = ?`;
  const values = [
    body.nama_pelanggan ?? existing.nama_pelanggan,
    body.no_hp ?? existing.no_hp,
    id
  ];

  await dbRun(query, values);
  return await findPelangganById(id);
};

/* =============== DELETE =============== */
const deletePelanggan = async (id) => {
  const { changes } = await dbRun('DELETE FROM pelanggan WHERE id_pelanggan = ?', [id]);
  return changes > 0;
};

/* =============== EXPORT SEMUA FUNGSI =============== */

module.exports = {
  findAllPelanggan,
  findPelangganById,
  createPelanggan,
  updatePelanggan,
  deletePelanggan
};