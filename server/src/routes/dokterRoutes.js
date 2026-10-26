const express = require('express');
const router = express.Router();
const dokterController = require('../controllers/dokterController');

router.get('/',        dokterController.getAllDokter);
router.get('/:id',     dokterController.getDokterById);
router.post('/',       dokterController.createDokter);
router.put('/:id',     dokterController.updateDokter);
router.delete('/:id',  dokterController.deleteDokter);
router.post('/bulk',   dokterController.bulkCreateDokter);

module.exports = router;