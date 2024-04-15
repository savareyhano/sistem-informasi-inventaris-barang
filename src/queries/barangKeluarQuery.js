const pool = require('../config/database');

const getDetail = async (id) => {
  const query = {
    text: 'SELECT * FROM public.keluar WHERE idkeluar = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0];
};

const getQty = async (id) => {
  const query = {
    text: 'SELECT * FROM public.keluar WHERE idkeluar = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows[0].qty;
};

const addBarangKeluar = async (
  idbarang,
  penerima,
  qty,
  namabarangKeluar,
  penginput,
  kodebarangKeluar,
) => {
  const query = {
    text: 'INSERT INTO public.keluar(idbarang, penerima, qty, namabarang_k, penginput, kodebarang_k) VALUES ($1, $2, $3, $4, $5, $6)',
    values: [idbarang, penerima, qty, namabarangKeluar, penginput, kodebarangKeluar],
  };

  await pool.query(query);
};

const updateBarangKeluar = async (penerima, qty, idkeluar) => {
  const query = {
    text: 'UPDATE public.keluar SET penerima= $1, qty = $2 WHERE idkeluar = $3',
    values: [penerima, qty, idkeluar],
  };

  await pool.query(query);
};

const delBarangKeluarId = async (id) => {
  const query = {
    text: 'DELETE FROM public.keluar WHERE idbarang = $1',
    values: [id],
  };

  await pool.query(query);
};

const delBarangKeluar = async (idkeluar) => {
  const query = {
    text: 'DELETE FROM public.keluar WHERE idkeluar = $1',
    values: [idkeluar],
  };

  await pool.query(query);
};

const getBarangK = async () => {
  const query = {
    text: 'SELECT * FROM public.keluar ORDER BY idkeluar DESC',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows;
};

const getDetailBarang = async (id) => {
  const query = {
    text: 'SELECT * FROM public.keluar WHERE idbarang = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const totalQty = async () => {
  const query = {
    text: 'SELECT SUM(qty) FROM keluar',
    values: [],
  };

  const result = await pool.query(query);
  return result.rows[0].sum;
};

module.exports = {
  getDetail,
  getQty,
  updateBarangKeluar,
  addBarangKeluar,
  delBarangKeluarId,
  delBarangKeluar,
  getBarangK,
  getDetailBarang,
  totalQty,
};
