const pool = require("../config/database");

const email = async (email) => {
  const { rows: resu } = await pool.query(
    `SELECT email FROM public.users WHERE email='${email}'`
  );
  if (resu.length > 0) {
    return resu[0].email;
  } else {
    return "undefined";
  }
};

const email2 = async (email) => {
  const { rows: resul } = await pool.query(
    `SELECT email FROM public.users WHERE LOWER(email)='${email}'`
  );
  if (resul.length > 0) {
    return resul[0].email;
  } else {
    return undefined;
  }
};

const password = async (password) => {
  const { rows: resul } = await pool.query(
    `SELECT password FROM public.users WHERE password='${password}'`
  );
  if (resul.length > 0) {
    return resul[0].password;
  } else {
    return "undefined";
  }
};

const role = async (email, password) => {
  const { rows: rol } = await pool.query(
    `SELECT role FROM public.users WHERE email='${email}' AND password='${password}'`
  );
  if (rol.length > 0) {
    return rol[0].role;
  } else {
    return "undefined";
  }
};

const getUsers = async () => {
  const { rows: usr } = await pool.query(
    `SELECT * FROM public.users ORDER BY id`
  );
  return usr;
};

const delUser = async (id) => {
  const del = await pool.query(`DELETE FROM public.users WHERE id='${id}'`);
  return del;
};

const addUser = async (email, password, role) => {
  const add = await pool.query(
    `INSERT INTO public.users(email, password, role) VALUES ( '${email}', '${password}', '${role}')`
  );
  return add;
};

const getDetail = async (id) => {
  const { rows: det } = await pool.query(
    `SELECT * FROM public.users WHERE id='${id}'`
  );
  return det[0];
};

const checkDuplicate = async (email) => {
  const { rows: dup } = await pool.query(
    `SELECT * FROM public.users WHERE LOWER(email)='${email}'`
  );
  return dup[0];
};

const updateUser = async (newUser) => {
  const { email, password, role, id } = newUser;
  return pool.query(
    `UPDATE public.users SET email='${email}', password='${password}', role='${role}' WHERE id='${id}'`
  );
};

const checkProfile = async (email) => {
  const { rows: prof } = await pool.query(
    `SELECT * FROM public.users WHERE email='${email}'`
  );
  return prof[0];
};

const updateEmail = async (newUser) => {
  const { email, id } = newUser;
  return pool.query(
    `UPDATE public.users SET email='${email}' WHERE id='${id}'`
  );
};

const updatePassword = async (password, id) => {
  return pool.query(
    `UPDATE public.users SET password='${password}' WHERE id='${id}'`
  );
};

const updateRole = async (newUser) => {
  const { role, id } = newUser;
  return pool.query(`UPDATE public.users SET role='${role}' WHERE id='${id}'`);
};

const checkPassword = async (email) => {
  const { rows: resul } = await pool.query(
    `SELECT password FROM public.users WHERE email='${email}'`
  );
  if (resul.length > 0) {
    return resul[0].password;
  } else {
    return "undefined";
  }
};

const checkRole = async (email) => {
  const { rows: rol } = await pool.query(
    `SELECT role FROM public.users WHERE email='${email}'`
  );
  if (rol.length > 0) {
    return rol[0].role;
  } else {
    return "undefined";
  }
};

const totalUsers = async () => {
  const { rows: total } = await pool.query(`SELECT COUNT(id) FROM users`);
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
