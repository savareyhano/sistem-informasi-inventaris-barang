const express = require('express');

const router = express.Router();
const {
  getBarang, getBarangDetail, addBarang, updateBarang, deleteBarang,
} = require('../controllers/barangController');

router.get('/barang', getBarang);
router.get('/barang/:id', getBarangDetail);
router.post('/barang', addBarang);
router.put('/barang/:id', updateBarang);
router.post('/barang/delete/:id', deleteBarang);

module.exports = router;
