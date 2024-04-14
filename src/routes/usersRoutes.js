const express = require('express');

const router = express.Router();
const {
  getUsers, addUser, updateUser, deleteUser, resetPassword,
} = require('../controllers/usersController');

router.get('/users', getUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.post('/users/delete/:id', deleteUser);
router.post('/users/resetpassword/:id', resetPassword);

module.exports = router;
