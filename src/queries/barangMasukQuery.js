const pool = require('../config/database');

// const getBarangMasuk = async () => {
//     const {rows : brg} = await pool.query(
//       `SELECT * FROM public.masuk m, public.stock s where s.idbarang = m.idbarang`
//       );
//     return brg;
// }

const getDetail = async (id) => {
  const { rows: det } = await pool.query(
    `SELECT * FROM public.masuk WHERE idmasuk='${id}'`,
  );
  return det[0];
};

const getQty = async (id) => {
  const { rows: qty } = await pool.query(
    `SELECT * FROM public.masuk WHERE idmasuk='${id}'`,
  );
  return qty[0].qty;
};

const addBarangMasuk = async (
  idbarang,
  keterangan,
  qty,
  namabarangMasuk,
  penginput,
  kodebarangMasuk,
) => {
  const add = await pool.query(
    `INSERT INTO public.masuk(idbarang, keterangan, qty, namabarangMasuk, penginput, kodebarangMasuk) VALUES ('${idbarang}', '${keterangan}', '${qty}', '${namabarangMasuk}', '${penginput}', '${kodebarangMasuk}')`,
  );
  return add;
};

const updateBarangMasuk = async (keterangan, qty, idmasuk) => pool.query(
  `UPDATE public.masuk SET keterangan='${keterangan}', qty='${qty}' WHERE idmasuk='${idmasuk}'`,
);

const delBarangMasukId = async (id) => {
  const del = await pool.query(
    `DELETE FROM public.masuk WHERE idbarang='${id}'`,
  );
  return del;
};

const delBarangMasuk = async (idmasuk) => {
  const del = await pool.query(
    `DELETE FROM public.masuk WHERE idmasuk='${idmasuk}'`,
  );
  return del;
};

const getBarangM = async () => {
  const { rows: brg } = await pool.query(
    'SELECT * FROM public.masuk ORDER by idmasuk DESC',
  );
  return brg;
};

const getDetailBarang = async (id) => {
  const { rows: det } = await pool.query(
    `SELECT * FROM public.masuk WHERE idbarang='${id}'`,
  );
  return det;
};

const totalQty = async () => {
  const { rows: total } = await pool.query('SELECT SUM(qty) FROM masuk');
  return total[0].sum;
};

module.exports = {
  getDetail,
  getQty,
  addBarangMasuk,
  updateBarangMasuk,
  delBarangMasukId,
  delBarangMasuk,
  getBarangM,
  getDetailBarang,
  totalQty,
};
