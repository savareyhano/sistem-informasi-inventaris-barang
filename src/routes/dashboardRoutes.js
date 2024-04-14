const express = require('express');

const router = express.Router();
const getIndex = require('../controllers/dashboardController');

router.get('/', getIndex);

module.exports = router;
