CREATE TABLE IF NOT EXISTS pasien (
    id_pasien INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_pasien VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(15),
    tanggal_lahir DATE,
    riwayat_singkat TEXT
);

CREATE TABLE IF NOT EXISTS dokter (
    id_dokter INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_dokter VARCHAR(100) NOT NULL,
    spesialisasi VARCHAR(100) NOT NULL,
    hari_kerja VARCHAR(50), 
    jam_kerja VARCHAR(20),  
    status_ketersediaan VARCHAR(20) DEFAULT 'Aktif'
);

CREATE TABLE IF NOT EXISTS jadwal_temu (
    id_jadwal INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pasien INTEGER NOT NULL,
    id_dokter INTEGER NOT NULL,
    tanggal_kunjungan DATE NOT NULL,
    jam_sesi VARCHAR(10), 
    status_antrean VARCHAR(20) DEFAULT 'Menunggu',
    catatan TEXT,
    FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien) ON DELETE CASCADE,
    FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter) ON DELETE CASCADE
);