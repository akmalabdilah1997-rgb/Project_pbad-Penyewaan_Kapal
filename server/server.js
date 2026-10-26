require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const testRoutes =  require('./src/routes/test');
const pasienRoutes = require('./src/routes/pasienRoutes')
const dokterRoutes = require('./src/routes/dokterRoutes');
const jadwalTemuRoutes = require('./src/routes/jadwalTemuRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Sistem Klinik is running',
    endpoints: {
      'PASIEN': {
        'GET    /api/products':      'Ambil semua data pasien',
        'GET    /api/products/:id':  'Ambil pasien by id',
        'POST   /api/products':      'Buat pasien baru',
        'PUT    /api/products/:id':  'Update data pasien',
        'DELETE /api/products/:id':  'Hapus data pasien',
      },
      'DOKTER': {
        'GET    /api/dokter':        'Ambil semua data dokter',
        'GET    /api/dokter/:id':    'Ambil dokter by id',
        'POST   /api/dokter':        'Buat dokter baru',
        'PUT    /api/dokter/:id':    'Update data dokter',
        'DELETE /api/dokter/:id':    'Hapus data dokter',
      },
      'JADWAL TEMU': {
        'GET    /api/jadwal-temu':       'Ambil semua data jadwal',
        'GET    /api/jadwal-temu/:id':   'Ambil jadwal by id',
        'POST   /api/jadwal-temu':       'Buat jadwal baru',
        'PUT    /api/jadwal-temu/:id':   'Update data jadwal',
        'DELETE /api/jadwal-temu/:id':   'Hapus data jadwal',
      }
    },
  });
});

/* Routes */
app.use('/api/test', testRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/dokter', dokterRoutes);         
app.use('/api/jadwal-temu', jadwalTemuRoutes); 

/* 404 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

/* Start */
(async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
})();