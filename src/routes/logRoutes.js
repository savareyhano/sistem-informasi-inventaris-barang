const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

router.get("/log", logController.getLog);

module.exports = router;
