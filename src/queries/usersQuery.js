const pool = require('../config/database');

const email = async (userEmail) => {
  const { rows: resu } = await pool.query(
    `SELECT email FROM public.users WHERE email='${userEmail}'`,
  );
  if (resu.length > 0) {
    return resu[0].email;
  }
  return 'undefined';
};

const email2 = async (userEmail) => {
  const { rows: resul } = await pool.query(
    `SELECT email FROM public.users WHERE LOWER(email)='${userEmail}'`,
  );
  if (resul.length > 0) {
    return resul[0].email;
  }
  return undefined;
};

const password = async (userPassword) => {
  const { rows: resul } = await pool.query(
    `SELECT password FROM public.users WHERE password='${userPassword}'`,
  );
  if (resul.length > 0) {
    return resul[0].password;
  }
  return 'undefined';
};

const role = async (userEmail, userPassword) => {
  const { rows: rol } = await pool.query(
    `SELECT role FROM public.users WHERE email='${userEmail}' AND password='${userPassword}'`,
  );
  if (rol.length > 0) {
    return rol[0].role;
  }
  return 'undefined';
};

const getUsers = async () => {
  const { rows: usr } = await pool.query(
    'SELECT * FROM public.users ORDER BY id',
  );
  return usr;
};

const delUser = async (id) => {
  const del = await pool.query(`DELETE FROM public.users WHERE id='${id}'`);
  return del;
};

const addUser = async (userEmail, userPassword, userRole) => {
  const add = await pool.query(
    `INSERT INTO public.users(email, password, role) VALUES ( '${userEmail}', '${userPassword}', '${userRole}')`,
  );
  return add;
};

const getDetail = async (id) => {
  const { rows: det } = await pool.query(
    `SELECT * FROM public.users WHERE id='${id}'`,
  );
  return det[0];
};

const checkDuplicate = async (userEmail) => {
  const { rows: dup } = await pool.query(
    `SELECT * FROM public.users WHERE LOWER(email)='${userEmail}'`,
  );
  return dup[0];
};

const updateUser = async (newUser) => {
  const {
    email: newEmail, password: newPassword, role: newRole, id,
  } = newUser;
  return pool.query(
    `UPDATE public.users SET email='${newEmail}', password='${newPassword}', role='${newRole}' WHERE id='${id}'`,
  );
};

const checkProfile = async (userEmail) => {
  const { rows: prof } = await pool.query(
    `SELECT * FROM public.users WHERE email='${userEmail}'`,
  );
  return prof[0];
};

const updateEmail = async (newUser) => {
  const { email: newEmail, id: newId } = newUser;
  return pool.query(
    `UPDATE public.users SET email='${newEmail}' WHERE id='${newId}'`,
  );
};

const updatePassword = async (newPassword, id) => pool.query(`UPDATE public.users SET password='${newPassword}' WHERE id='${id}'`);

const updateRole = async (newUser) => {
  const { role: newRole, id } = newUser;
  return pool.query(`UPDATE public.users SET role='${newRole}' WHERE id='${id}'`);
};

const checkPassword = async (userEmail) => {
  const { rows: resul } = await pool.query(
    `SELECT password FROM public.users WHERE email='${userEmail}'`,
  );
  if (resul.length > 0) {
    return resul[0].password;
  }
  return 'undefined';
};

const checkRole = async (userEmail) => {
  const { rows: rol } = await pool.query(
    `SELECT role FROM public.users WHERE email='${userEmail}'`,
  );
  if (rol.length > 0) {
    return rol[0].role;
  }
  return 'undefined';
};

const totalUsers = async () => {
  const { rows: total } = await pool.query('SELECT COUNT(id) FROM users');
  return total[0].count;
};

module.exports = {
  email,
  email2,
  password,
  role,
  getUsers,
  delUser,
  addUser,
  getDetail,
  checkDuplicate,
  updateUser,
  checkProfile,
  updateEmail,
  updatePassword,
  updateRole,
  checkPassword,
  checkRole,
  totalUsers,
};
