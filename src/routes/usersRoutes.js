const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/users", usersController.getUsers);
router.post("/users", usersController.addUser);
router.put("/users/:id", usersController.updateUser);
router.post("/users/delete/:id", usersController.deleteUser);
router.post("/users/resetpassword/:id", usersController.resetPassword);

module.exports = router;
