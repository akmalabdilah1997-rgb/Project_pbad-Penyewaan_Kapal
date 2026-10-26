const express = require('express');
const router = express.Router();
const productController = require('../controllers/pasienController');

router.get('/',        productController.getAllPasien);
router.get('/:id',     productController.getPasienById);
router.post('/',       productController.createPasien);
router.put('/:id',     productController.updatePasien);
router.delete('/:id',  productController.deletePasien);

// testpurpose
router.post('/bulk',   productController.bulkCreatePasien);

module.exports = router;