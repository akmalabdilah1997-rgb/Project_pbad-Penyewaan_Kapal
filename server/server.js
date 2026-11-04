require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const testRoutes =  require('./src/routes/test');
const pelangganRoutes = require('./src/routes/pelangganRoutes'); 
const kapalRoutes = require('./src/routes/kapalRoutes');         
const penyewaanRoutes = require('./src/routes/penyewaanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Sistem Sewa Kapal is running',
    endpoints: {
      'PELANGGAN': {
        'GET    /api/pelanggan':      'Ambil semua data pelanggan',
        'GET    /api/pelanggan/:id':  'Ambil pelanggan by id',
        'POST   /api/pelanggan':      'Buat pelanggan baru',
        'PUT    /api/pelanggan/:id':  'Update data pelanggan',
        'DELETE /api/pelanggan/:id':  'Hapus data pelanggan',
      },
      'KAPAL': {
        'GET    /api/kapal':          'Ambil semua data kapal',
        'GET    /api/kapal/:id':      'Ambil kapal by id',
        'POST   /api/kapal':          'Buat kapal baru',
        'PUT    /api/kapal/:id':      'Update data kapal',
        'DELETE /api/kapal/:id':      'Hapus data kapal',
      },
      'PENYEWAAN': {
        'GET    /api/penyewaan':      'Ambil semua data penyewaan',
        'GET    /api/penyewaan/:id':  'Ambil penyewaan by id',
        'POST   /api/penyewaan':      'Buat penyewaan baru',
        'PUT    /api/penyewaan/:id':  'Update data penyewaan',
        'DELETE /api/penyewaan/:id':  'Hapus data penyewaan',
      }
    },
  });
});

/* Routes */
app.use('/api/test', testRoutes);
app.use('/api/pelanggan', pelangganRoutes); 
app.use('/api/kapal', kapalRoutes);         
app.use('/api/penyewaan', penyewaanRoutes); 

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