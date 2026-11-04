const express = require('express');
const router = express.Router();
const kapalController = require('../controllers/kapalController');

router.get('/',        kapalController.getAllKapal);
router.get('/:id',     kapalController.getKapalById);
router.post('/',       kapalController.createKapal);
router.put('/:id',     kapalController.updateKapal);
router.delete('/:id',  kapalController.deleteKapal);
router.post('/bulk',   kapalController.bulkCreateKapal);

module.exports = router;