const express = require("express");
const router = express.Router();
const barangKeluarController = require("../controllers/barangKeluarController");

router.get("/barangkeluar", barangKeluarController.getBarangKeluar);
router.post("/barangkeluar", barangKeluarController.addBarangKeluar);
router.put("/barangkeluar/:id", barangKeluarController.updateBarangKeluar);
router.post(
  "/barangkeluar/delete/:id",
  barangKeluarController.deleteBarangKeluar
);

module.exports = router;
