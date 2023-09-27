const express = require("express");
const router = express.Router();
const barangMasukController = require("../controllers/barangMasukController");

router.get("/barangmasuk", barangMasukController.getBarangMasuk);
router.post("/barangmasuk", barangMasukController.addBarangMasuk);
router.put("/barangmasuk/:id", barangMasukController.updateBarangMasuk);
router.post("/barangmasuk/delete/:id", barangMasukController.deleteBarangMasuk);

module.exports = router;
