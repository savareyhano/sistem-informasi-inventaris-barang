const pool = require('../config/database');

const getBarang = async () => {
  const query = {
    text: 'SELECT * FROM public.stock ORDER BY idbarang',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows;
};

const cekKode = async (kodebarang) => {
  const query = {
    text: 'SELECT kodebarang FROM public.stock WHERE LOWER(kodebarang) = $1',
    values: [kodebarang],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return undefined;
  }

  return result.rows[0].kodebarang;
};

const cekBarang = async (namabarang) => {
  const query = {
    text: 'SELECT namabarang FROM public.stock WHERE LOWER(namabarang) = $1',
    values: [namabarang],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return undefined;
  }

  return result.rows[0].namabarang;
};

const addBarang = async (
  namabarang,
  deskripsi,
  stock,
  image,
  penginput,
  kodebarang,
) => {
  const query = {
    text: 'INSERT INTO public.stock(namabarang, deskripsi, stock, image, penginput, kodebarang) VALUES ($1, $2, $3, $4, $5, $6)',
    values: [namabarang, deskripsi, stock, image, penginput, kodebarang],
  };

  await pool.query(query);
};

const getImage = async (id) => {
  const query = {
    text: 'SELECT image FROM public.stock WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0].image;
};

const delBarang = async (id) => {
  const query = {
    text: 'DELETE FROM public.stock WHERE idbarang = $1',
    values: [id],
  };

  await pool.query(query);
};

const getDetail = async (id) => {
  const query = {
    text: 'SELECT * FROM public.stock WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const updateBarang = async (
  namabarang,
  deskripsi,
  stock,
  image,
  kodebarang,
  idbarang,
) => {
  const query = {
    text: 'UPDATE public.stock SET namabarang = $1, deskripsi = $2, stock = $3, image = $4, kodebarang = $5 WHERE idbarang = $6',
    values: [namabarang, deskripsi, stock, image, kodebarang, idbarang],
  };

  await pool.query(query);
};

const getStock = async (id) => {
  const query = {
    text: 'SELECT * FROM public.stock WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);

  if (!result.rowCount) {
    return 'undefined';
  }

  return result.rows[0].stock;
};

const updateStock = async (newStock, idbarang) => {
  const query = {
    text: 'UPDATE public.stock SET stock = $1 WHERE idbarang = $2',
    values: [newStock, idbarang],
  };

  await pool.query(query);
};

const checkKodeDuplicate = async (kodebarang) => {
  const query = {
    text: 'SELECT * FROM public.stock WHERE LOWER(kodebarang) = $1',
    values: [kodebarang],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const checkDuplicate = async (namabarang) => {
  const query = {
    text: 'SELECT * FROM public.stock WHERE LOWER(namabarang) = $1',
    values: [namabarang],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const getKode = async (id) => {
  const query = {
    text: 'SELECT kodebarang FROM public.stock WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0].kodebarang;
};

const getNama = async (id) => {
  const query = {
    text: 'SELECT namabarang FROM public.stock WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0].namabarang;
};

const totalStock = async () => {
  const query = {
    text: 'SELECT SUM(stock) FROM stock',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows[0].sum;
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
