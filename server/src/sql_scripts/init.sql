
CREATE TABLE IF NOT EXISTS pelanggan (
    id_pelanggan INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_pelanggan VARCHAR(100) NOT NULL,
    no_hp VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS kapal (
    id_kapal INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_kapal VARCHAR(100) NOT NULL,
    merek VARCHAR(100),
    jenis VARCHAR(100),
    harga_sewa INTEGER NOT NULL,
    status_kapal VARCHAR(20) DEFAULT 'Tersedia',
    catatan TEXT
);

CREATE TABLE IF NOT EXISTS penyewaan (
    id_sewa INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pelanggan INTEGER NOT NULL,
    id_kapal INTEGER NOT NULL,
    tanggal_sewa DATE NOT NULL,
    status_pesanan VARCHAR(20) DEFAULT 'Menunggu ACC',
    catatan TEXT,
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE CASCADE,
    FOREIGN KEY (id_kapal) REFERENCES kapal(id_kapal) ON DELETE CASCADE
);