const express = require('express');

const router = express.Router();
const {
  getBarangKeluar, addBarangKeluar, updateBarangKeluar, deleteBarangKeluar,
} = require('../controllers/barangKeluarController');

router.get('/barangkeluar', getBarangKeluar);
router.post('/barangkeluar', addBarangKeluar);
router.put('/barangkeluar/:id', updateBarangKeluar);
router.post(
  '/barangkeluar/delete/:id',
  deleteBarangKeluar,
);

module.exports = router;
