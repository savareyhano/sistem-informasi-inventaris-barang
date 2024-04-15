const pool = require('../config/database');

const email = async (userEmail) => {
  const query = {
    text: 'SELECT email FROM public.users WHERE email = $1',
    values: [userEmail],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return 'undefined';
  }

  return result.rows[0].email;
};

const email2 = async (userEmail) => {
  const query = {
    text: 'SELECT email FROM public.users WHERE LOWER(email) = $1',
    values: [userEmail],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return undefined;
  }

  return result.rows[0].email;
};

const password = async (userPassword) => {
  const query = {
    text: 'SELECT password FROM public.users WHERE password = $1',
    values: [userPassword],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return 'undefined';
  }

  return result.rows[0].password;
};

const role = async (userEmail, userPassword) => {
  const query = {
    text: 'SELECT role FROM public.users WHERE email = $1 AND password = $2',
    values: [userEmail, userPassword],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return 'undefined';
  }

  return result.rows[0].role;
};

const getUsers = async () => {
  const query = {
    text: 'SELECT * FROM public.users ORDER BY id',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows;
};

const delUser = async (id) => {
  const query = {
    text: 'DELETE FROM public.users WHERE id = $1',
    values: [id],
  };

  await pool.query(query);
};

const addUser = async (userEmail, userPassword, userRole) => {
  const query = {
    text: 'INSERT INTO public.users(email, password, role) VALUES ($1, $2, $3)',
    values: [userEmail, userPassword, userRole],
  };

  await pool.query(query);
};

const getDetail = async (id) => {
  const query = {
    text: 'SELECT * FROM public.users WHERE id = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const checkDuplicate = async (userEmail) => {
  const query = {
    text: 'SELECT * FROM public.users WHERE LOWER(email) = $1',
    values: [userEmail],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const updateUser = async (newUser) => {
  const {
    email: newEmail, password: newPassword, role: newRole, id,
  } = newUser;
  const query = {
    text: 'UPDATE public.users SET email = $1, password = $2, role = $3 WHERE id = $4',
    values: [newEmail, newPassword, newRole, id],
  };

  await pool.query(query);
};

const checkProfile = async (userEmail) => {
  const query = {
    text: 'SELECT * FROM public.users WHERE email = $1',
    values: [userEmail],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const updateEmail = async (newUser) => {
  const { email: newEmail, id: newId } = newUser;
  const query = {
    text: 'UPDATE public.users SET email = $1 WHERE id = $2',
    values: [newEmail, newId],
  };

  await pool.query(query);
};

const updatePassword = async (newPassword, id) => {
  const query = {
    text: 'UPDATE public.users SET password = $1 WHERE id = $2',
    values: [newPassword, id],
  };

  await pool.query(query);
};

const updateRole = async (newUser) => {
  const { role: newRole, id } = newUser;
  const query = {
    text: 'UPDATE public.users SET role = $1 WHERE id = $2',
    values: [newRole, id],
  };

  await pool.query(query);
};

const checkPassword = async (userEmail) => {
  const query = {
    text: 'SELECT password FROM public.users WHERE email = $1',
    values: [userEmail],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return 'undefined';
  }

  return result.rows[0].password;
};

const checkRole = async (userEmail) => {
  const query = {
    text: 'SELECT role FROM public.users WHERE email = $1',
    values: [userEmail],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return 'undefined';
  }

  return result.rows[0].role;
};

const totalUsers = async () => {
  const query = {
    text: 'SELECT COUNT(id) FROM users',
    values: [],
  };

  const result = await pool.query(query);

  return result.rows[0].count;
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
