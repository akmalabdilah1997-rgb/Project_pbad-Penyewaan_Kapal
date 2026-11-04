const express = require('express');
const router = express.Router();
const penyewaanController = require('../controllers/penyewaanController');

router.get('/',        penyewaanController.getAllPenyewaan);
router.get('/:id',     penyewaanController.getPenyewaanById);
router.post('/',       penyewaanController.createPenyewaan);
router.put('/:id',     penyewaanController.updatePenyewaan);
router.delete('/:id',  penyewaanController.deletePenyewaan);
router.post('/bulk',   penyewaanController.bulkCreatePenyewaan);

module.exports = router;