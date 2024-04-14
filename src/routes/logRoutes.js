const express = require('express');

const router = express.Router();
const getLog = require('../controllers/logController');

router.get('/log', getLog);

module.exports = router;
