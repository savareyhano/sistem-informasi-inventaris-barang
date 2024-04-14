const express = require('express');

const router = express.Router();
const {
  getBarangMasuk, addBarangMasuk, updateBarangMasuk, deleteBarangMasuk,
} = require('../controllers/barangMasukController');

router.get('/barangmasuk', getBarangMasuk);
router.post('/barangmasuk', addBarangMasuk);
router.put('/barangmasuk/:id', updateBarangMasuk);
router.post('/barangmasuk/delete/:id', deleteBarangMasuk);

module.exports = router;
