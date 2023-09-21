const pool = require("../database");

// const getBarangKeluar = async () => {
//     const {rows : brg} = await pool.query(`SELECT * FROM public.keluar k, public.stock s where s.idbarang = k.idbarang`)
//     return brg;
// }

const getDetail = async (id) => {
    const {rows : det} = await pool.query(`SELECT * FROM public.keluar WHERE idkeluar='${id}'`)
    return det[0];
}

const getQty = async (id) => {
    const {rows : qty} = await pool.query(`SELECT * FROM public.keluar WHERE idkeluar='${id}'`)
    return qty[0].qty;
}

const addBarangKeluar = async (idbarang, penerima, qty, namabarang_k, penginput, kodebarang_k) => {
    const add = await pool.query(`INSERT INTO public.keluar(idbarang, penerima, qty, namabarang_k, penginput, kodebarang_k) VALUES ('${idbarang}', '${penerima}', '${qty}', '${namabarang_k}', '${penginput}', '${kodebarang_k}')`)
    return add;
}

const updateBarangKeluar = async (penerima, qty, idkeluar) => {
    return pool.query(`UPDATE public.keluar SET penerima='${penerima}', qty='${qty}' WHERE idkeluar='${idkeluar}'`);
}

const delBarangKeluarId = async (id) => {
    const del = await pool.query(`DELETE FROM public.keluar WHERE idbarang='${id}'`);
    return del;
}

const delBarangKeluar = async (idkeluar) => {
    const del = await pool.query(`DELETE FROM public.keluar WHERE idkeluar='${idkeluar}'`);
    return del;
}

const getBarangK = async () => {
    const {rows : brg} = await pool.query(`SELECT * FROM public.keluar ORDER BY idkeluar DESC`)
    return brg;
}

const getDetailBarang = async (id) => {
    const {rows : det} = await pool.query(`SELECT * FROM public.keluar WHERE idbarang='${id}'`)
    return det;
}

const totalQty = async () => {
    const {rows : total} = await pool.query(`SELECT SUM(qty) FROM keluar`)
    return total[0].sum;
}

module.exports = {
    // getBarangKeluar,
    getDetail,
    getQty,
    updateBarangKeluar,
    addBarangKeluar,
    delBarangKeluarId,
    delBarangKeluar,
    getBarangK,
    getDetailBarang,
    totalQty
}