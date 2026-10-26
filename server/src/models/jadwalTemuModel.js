const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllJadwal = async () => {
  return await dbAll('SELECT * FROM jadwal_temu ORDER BY id_jadwal DESC');
};

const findJadwalById = async (id) => {
  return await dbGet('SELECT * FROM jadwal_temu WHERE id_jadwal = ?', [id]);
};

const createJadwal = async (body) => {
  const query = `
    INSERT INTO jadwal_temu (id_pasien, id_dokter, tanggal_kunjungan, jam_sesi, status_antrean, catatan)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.id_pasien,
    body.id_dokter,
    body.tanggal_kunjungan,
    body.jam_sesi ?? null, 
    body.status_antrean ?? 'Menunggu',
    body.catatan ?? null,
  ];

  const { lastID } = await dbRun(query, values);
  return await findJadwalById(lastID);
};

const updateJadwal = async (id, body) => {
  const existing = await findJadwalById(id);
  if (!existing) return null;

  const query = `
    UPDATE jadwal_temu
    SET id_pasien = ?, id_dokter = ?, tanggal_kunjungan = ?, jam_sesi = ?, status_antrean = ?, catatan = ?
    WHERE id_jadwal = ?
  `;
  const values = [
    body.id_pasien ?? existing.id_pasien,
    body.id_dokter ?? existing.id_dokter,
    body.tanggal_kunjungan ?? existing.tanggal_kunjungan,
    body.jam_sesi !== undefined ? body.jam_sesi : existing.jam_sesi, 
    body.status_antrean ?? existing.status_antrean,
    body.catatan !== undefined ? body.catatan : existing.catatan,
    id,
  ];

  await dbRun(query, values);
  return await findJadwalById(id);
};

const deleteJadwal = async (id) => {
  const { changes } = await dbRun('DELETE FROM jadwal_temu WHERE id_jadwal = ?', [id]);
  return changes > 0;
};

const bulkCreateJadwal = async (jadwalList) => {
  await dbRun('BEGIN TRANSACTION');
  try {
    const createdJadwal = [];
    for (const j of jadwalList) {
      const result = await dbRun(
        `INSERT INTO jadwal_temu (id_pasien, id_dokter, tanggal_kunjungan, jam_sesi, status_antrean, catatan) VALUES (?, ?, ?, ?, ?, ?)`,
        [j.id_pasien, j.id_dokter, j.tanggal_kunjungan, j.jam_sesi ?? null, j.status_antrean ?? 'Menunggu', j.catatan ?? null]
      );
      createdJadwal.push({ id_jadwal: result.lastID, ...j });
    }
    await dbRun('COMMIT');
    return createdJadwal;
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }
};

module.exports = {
  findAllJadwal, findJadwalById, createJadwal, updateJadwal, deleteJadwal, bulkCreateJadwal
};