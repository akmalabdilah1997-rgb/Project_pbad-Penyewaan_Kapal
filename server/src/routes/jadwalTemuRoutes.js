const express = require('express');
const router = express.Router();
const jadwalTemuController = require('../controllers/jadwalTemuController');

router.get('/',        jadwalTemuController.getAllJadwal);
router.get('/:id',     jadwalTemuController.getJadwalById);
router.post('/',       jadwalTemuController.createJadwal);
router.put('/:id',     jadwalTemuController.updateJadwal);
router.delete('/:id',  jadwalTemuController.deleteJadwal);
router.post('/bulk',   jadwalTemuController.bulkCreateJadwal);

module.exports = router;