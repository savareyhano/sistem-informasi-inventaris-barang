const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/account", accountController.getAccount);
router.put("/account/changeemail", accountController.changeEmail);
router.put("/account/changepassword", accountController.changePassword);
router.put("/account/changerole", accountController.changeRole);

module.exports = router;
