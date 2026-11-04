const express = require('express');
const router = express.Router();
const pelangganController = require('../controllers/pelangganController');

router.get('/',        pelangganController.getAllPelanggan);
router.get('/:id',     pelangganController.getPelangganById);
router.post('/',       pelangganController.createPelanggan);
router.put('/:id',     pelangganController.updatePelanggan);
router.delete('/:id',  pelangganController.deletePelanggan);

// testpurpose
router.post('/bulk',   pelangganController.bulkCreatePelanggan);

module.exports = router;