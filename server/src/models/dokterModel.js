const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllDokter = async () => {
  return await dbAll('SELECT * FROM dokter');
};

const findDokterById = async (id) => {
  return await dbGet('SELECT * FROM dokter WHERE id_dokter = ?', [id]);
};

const createDokter = async (body) => {
  const query = `
    INSERT INTO dokter (nama_dokter, spesialisasi, hari_kerja, jam_kerja, status_ketersediaan)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    body.nama_dokter, 
    body.spesialisasi, 
    body.hari_kerja ?? null,
    body.jam_kerja ?? null,
    body.status_ketersediaan ?? 'Aktif'
  ];

  const { lastID } = await dbRun(query, values);
  return await findDokterById(lastID);
};

const updateDokter = async (id, body) => {
  const existing = await findDokterById(id);
  if (!existing) return null;

  const query = `
    UPDATE dokter
    SET nama_dokter = ?, spesialisasi = ?, hari_kerja = ?, jam_kerja = ?, status_ketersediaan = ?
    WHERE id_dokter = ?
  `;
  const values = [
    body.nama_dokter ?? existing.nama_dokter,
    body.spesialisasi ?? existing.spesialisasi,
    body.hari_kerja !== undefined ? body.hari_kerja : existing.hari_kerja,
    body.jam_kerja !== undefined ? body.jam_kerja : existing.jam_kerja,
    body.status_ketersediaan ?? existing.status_ketersediaan,
    id,
  ];

  await dbRun(query, values);
  return await findDokterById(id);
};

const deleteDokter = async (id) => {
  const { changes } = await dbRun('DELETE FROM dokter WHERE id_dokter = ?', [id]);
  return changes > 0;
};

const bulkCreateDokter = async (dokterList) => {
  await dbRun('BEGIN TRANSACTION');
  try {
    const createdDokter = [];
    for (const d of dokterList) {
      const result = await dbRun(
        `INSERT INTO dokter (nama_dokter, spesialisasi, hari_kerja, jam_kerja, status_ketersediaan) VALUES (?, ?, ?, ?, ?)`,
        [d.nama_dokter, d.spesialisasi, d.hari_kerja ?? null, d.jam_kerja ?? null, d.status_ketersediaan ?? 'Aktif']
      );
      createdDokter.push({ id_dokter: result.lastID, ...d });
    }
    await dbRun('COMMIT');
    return createdDokter;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

module.exports = {
  findAllDokter, findDokterById, createDokter, updateDokter, deleteDokter, bulkCreateDokter
};