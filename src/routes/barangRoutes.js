const express = require("express");
const router = express.Router();
const barangController = require("../controllers/barangController");

router.get("/barang", barangController.getBarang);
router.get("/barang/:id", barangController.getBarangDetail);
router.post("/barang", barangController.addBarang);
router.put("/barang/:id", barangController.updateBarang);
router.post("/barang/delete/:id", barangController.deleteBarang);

module.exports = router;
