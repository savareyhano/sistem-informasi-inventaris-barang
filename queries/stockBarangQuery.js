const pool = require("../database");

const getBarang = async () => {
  const { rows: brg } = await pool.query(
    `SELECT * FROM public.stock ORDER BY idbarang`
  );
  return brg;
};

const cekKode = async (kodebarang) => {
  const { rows: res } = await pool.query(
    `SELECT kodebarang FROM public.stock WHERE LOWER(kodebarang)='${kodebarang}'`
  );
  if (res.length > 0) {
    return res[0].kodebarang;
  } else {
    return undefined;
  }
};

const cekBarang = async (namabarang) => {
  const { rows: resu } = await pool.query(
    `SELECT namabarang FROM public.stock WHERE LOWER(namabarang)='${namabarang}'`
  );
  if (resu.length > 0) {
    return resu[0].namabarang;
  } else {
    return undefined;
  }
};

const addBarang = async (
  namabarang,
  deskripsi,
  stock,
  image,
  penginput,
  kodebarang
) => {
  const add = await pool.query(
    `INSERT INTO public.stock(namabarang, deskripsi, stock, image, penginput, kodebarang) VALUES ('${namabarang}', '${deskripsi}', '${stock}', '${image}', '${penginput}', '${kodebarang}')`
  );
  return add;
};

const getImage = async (id) => {
  const { rows: img } = await pool.query(
    `SELECT image FROM public.stock WHERE idbarang='${id}'`
  );
  return img[0].image;
};

const delBarang = async (id) => {
  const del = await pool.query(
    `DELETE FROM public.stock WHERE idbarang='${id}'`
  );
  return del;
};

const getDetail = async (id) => {
  const { rows: det } = await pool.query(
    `SELECT * FROM public.stock WHERE idbarang='${id}'`
  );
  return det[0];
};

const updateBarang = async (
  namabarang,
  deskripsi,
  stock,
  image,
  kodebarang,
  idbarang
) => {
  return pool.query(
    `UPDATE public.stock SET namabarang='${namabarang}', deskripsi='${deskripsi}', stock='${stock}', image='${image}', kodebarang='${kodebarang}' WHERE idbarang='${idbarang}'`
  );
};

const getStock = async (id) => {
  const { rows: stock } = await pool.query(
    `SELECT * FROM public.stock WHERE idbarang='${id}'`
  );
  if (stock.length > 0) {
    return stock[0].stock;
  } else {
    return "undefined";
  }
};

const updateStock = async (newStock, idbarang) => {
  return pool.query(
    `UPDATE public.stock SET stock='${newStock}' WHERE idbarang='${idbarang}'`
  );
};

const checkKodeDuplicate = async (kodebarang) => {
  const { rows: du } = await pool.query(
    `SELECT * FROM public.stock WHERE LOWER(kodebarang)='${kodebarang}'`
  );
  return du[0];
};

const checkDuplicate = async (namabarang) => {
  const { rows: dup } = await pool.query(
    `SELECT * FROM public.stock WHERE LOWER(namabarang)='${namabarang}'`
  );
  return dup[0];
};

const getKode = async (id) => {
  const { rows: kode } = await pool.query(
    `SELECT kodebarang FROM public.stock WHERE idbarang='${id}'`
  );
  return kode[0].kodebarang;
};

const getNama = async (id) => {
  const { rows: nama } = await pool.query(
    `SELECT namabarang FROM public.stock WHERE idbarang='${id}'`
  );
  return nama[0].namabarang;
};

const totalStock = async () => {
  const { rows: total } = await pool.query(`SELECT SUM(stock) FROM stock`);
  return total[0].sum;
};

module.exports = {
  getBarang,
  cekKode,
  cekBarang,
  addBarang,
  getImage,
  delBarang,
  getDetail,
  updateBarang,
  getStock,
  updateStock,
  checkKodeDuplicate,
  checkDuplicate,
  getKode,
  getNama,
  totalStock,
};
