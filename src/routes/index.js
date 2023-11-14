const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const usersRoutes = require('./usersRoutes');
const accountRoutes = require('./accountRoutes');
const barangRoutes = require('./barangRoutes');
const barangMasukRoutes = require('./barangMasukRoutes');
const barangKeluarRoutes = require('./barangKeluarRoutes');
const logRoutes = require('./logRoutes');

router.use(authRoutes);
router.use(dashboardRoutes);
router.use(usersRoutes);
router.use(accountRoutes);
router.use(barangRoutes);
router.use(barangMasukRoutes);
router.use(barangKeluarRoutes);
router.use(logRoutes);

module.exports = router;