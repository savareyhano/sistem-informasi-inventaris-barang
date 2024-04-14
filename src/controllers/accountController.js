const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const user = require('../queries/usersQuery');

const getAccount = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const users = await user.checkProfile(req.session.user.email);
    res.render('account', {
      usr: users,
      user: req.session.user.email,
      title: 'Edit Akun',
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const users = await user.checkProfile(req.session.user.email);
    res.render('account', {
      usr: users,
      us: req.session.user.email,
      title: 'Edit Akun',
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const changeEmail = [
  body('email').custom(async (value, { req }) => {
    const duplicate = await user.checkDuplicate(value.toLowerCase());
    if (value === req.body.oldEmail) {
      throw new Error(
        'Ganti email gagal: email baru tidak boleh sama dengan email sekarang.',
      );
    }
    if (duplicate) {
      throw new Error('Ganti email gagal: email sudah ada.');
    }
    return true;
  }),
  body('password').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error('Ganti email gagal: kata sandi salah.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.email !== 'superadmin@email.com') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Akun',
          errors: errors.array(),
          usr: req.body,
          user: req.session.user.email,
        });
      } else {
        await user.updateEmail(req.body);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Ganti email berhasil, silahkan masuk kembali.',
        });
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const changePassword = [
  body('oldPassword').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error('Ganti kata sandi gagal: kata sandi lama salah.');
    }
    return true;
  }),
  body('password').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (checkPass) {
      throw new Error(
        'Ganti kata sandi gagal: kata sandi baru tidak boleh sama dengan kata sandi lama.',
      );
    }
    return true;
  }),
  body('confirmPassword').custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        'Ganti kata sandi gagal: kata sandi baru dan konfirmasi kata sandi baru tidak cocok.',
      );
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Akun',
          errors: errors.array(),
          usr: req.body,
          user: req.session.user.email,
        });
      } else {
        const password = await bcrypt.hash(req.body.password, 10);
        const { id } = req.body;

        await user.updatePassword(password, id);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Ganti kata sandi berhasil, silahkan masuk kembali.',
        });
      }
    } else if (req.session.user && req.session.user.role === 'user') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Akun',
          errors: errors.array(),
          usr: req.body,
          us: req.session.user.email,
        });
      } else {
        const password = await bcrypt.hash(req.body.password, 10);
        const { id } = req.body;

        await user.updatePassword(password, id);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Ganti kata sandi berhasil, silahkan masuk kembali.',
        });
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const changeRole = [
  body('password').custom(async (value, { req }) => {
    const checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error('Ganti role gagal: kata sandi salah.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.email !== 'superadmin@email.com') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('account', {
          title: 'Akun',
          errors: errors.array(),
          usr: req.body,
          user: req.session.user.email,
        });
      } else {
        await user.updateRole(req.body);
        req.session = null;
        res.render('login', {
          title: 'Login',
          logout: 'Ganti role berhasil, silahkan masuk kembali.',
        });
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

module.exports = {
  getAccount,
  changeEmail,
  changePassword,
  changeRole,
};
