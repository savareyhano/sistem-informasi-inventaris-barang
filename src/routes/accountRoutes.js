const express = require('express');

const router = express.Router();
const {
  getAccount, changeEmail, changePassword, changeRole,
} = require('../controllers/accountController');

router.get('/account', getAccount);
router.put('/account/changeemail', changeEmail);
router.put('/account/changepassword', changePassword);
router.put('/account/changerole', changeRole);

module.exports = router;
