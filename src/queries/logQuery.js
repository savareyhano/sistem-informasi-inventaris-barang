const pool = require("../config/database");

const getLog = async () => {
  const { rows: log } = await pool.query(
    `SELECT * FROM public.log ORDER BY idlog DESC`
  );
  return log;
};

const addLog = (usr, method, endpoint, statusCode) => {
  const add = pool.query(
    `INSERT INTO public.log(usr, method, endpoint, status_code) VALUES ('${usr}', '${method}', '${endpoint}', '${statusCode}')`
  );
  return add;
};

// const delLog = async () => {
//   const del = await pool.query(`DELETE FROM public.log`);
//   return del;
// };

module.exports = {
  getLog,
  addLog,
};
