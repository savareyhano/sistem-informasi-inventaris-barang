const pool = require('../config/database');

const getDetail = async (id) => {
  const query = {
    text: 'SELECT * FROM public.masuk WHERE idmasuk = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const getQty = async (id) => {
  const query = {
    text: 'SELECT * FROM public.masuk WHERE idmasuk = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0].qty;
};

const addBarangMasuk = async (
  idbarang,
  keterangan,
  qty,
  namabarangMasuk,
  penginput,
  kodebarangMasuk,
) => {
  const query = {
    text: 'INSERT INTO public.masuk(idbarang, keterangan, qty, namabarang_m, penginput, kodebarang_m) VALUES ($1, $2, $3, $4, $5, $6)',
    values: [idbarang, keterangan, qty, namabarangMasuk, penginput, kodebarangMasuk],
  };

  await pool.query(query);
};

const updateBarangMasuk = async (keterangan, qty, idmasuk) => {
  const query = {
    text: 'UPDATE public.masuk SET keterangan = $1, qty = $2 WHERE idmasuk = $3',
    values: [keterangan, qty, idmasuk],
  };

  await pool.query(query);
};

const delBarangMasukId = async (id) => {
  const query = {
    text: 'DELETE FROM public.masuk WHERE idbarang = $1',
    values: [id],
  };

  await pool.query(query);
};

const delBarangMasuk = async (idmasuk) => {
  const query = {
    text: 'DELETE FROM public.masuk WHERE idmasuk = $1',
    values: [idmasuk],
  };

  await pool.query(query);
};

const getBarangM = async () => {
  const query = {
    text: 'SELECT * FROM public.masuk ORDER by idmasuk DESC',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows;
};

const getDetailBarang = async (id) => {
  const query = {
    text: 'SELECT * FROM public.masuk WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const totalQty = async () => {
  const query = {
    text: 'SELECT SUM(qty) FROM masuk',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows[0].sum;
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
