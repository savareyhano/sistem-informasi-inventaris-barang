const moment = require('moment');
const stok = require('../queries/stockBarangQuery');
const bkeluar = require('../queries/barangKeluarQuery');

const getBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const barangKeluar = await bkeluar.getBarangK();
    const barang = await stok.getBarang();
    res.render('barangKeluar', {
      user: req.session.user.email,
      title: 'Barang Keluar',
      brgk: barangKeluar,
      moment,
      brg: barang,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const barangKeluar = await bkeluar.getBarangK();
    const barang = await stok.getBarang();
    res.render('barangKeluar', {
      us: req.session.user.email,
      title: 'Barang Keluar',
      brgk: barangKeluar,
      moment,
      brg: barang,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const addBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const idbarang = req.body.barang;
    const { penerima } = req.body;
    const { qty } = req.body;
    const namabarangKeluar = await stok.getNama(idbarang);
    const penginput = req.session.user.email;
    const kodebarangKeluar = await stok.getKode(idbarang);

    const stock = await stok.getStock(idbarang);
    const newStock = parseInt(stock, 10) - parseInt(qty, 10);

    if (newStock < 0) {
      const barangKeluar = await bkeluar.getBarangK();
      const barang = await stok.getBarang();
      res.render('barangKeluar', {
        user: req.session.user.email,
        title: 'Barang Keluar',
        brgk: barangKeluar,
        moment,
        error: 'Tambah barang keluar gagal: stok barang tidak mencukupi.',
        brg: barang,
      });
    } else {
      await stok.updateStock(newStock, idbarang);
      await bkeluar.addBarangKeluar(
        idbarang,
        penerima,
        qty,
        namabarangKeluar,
        penginput,
        kodebarangKeluar,
      );

      res.redirect('/barangkeluar');
    }
  } else if (req.session.user && req.session.user.role === 'user') {
    const idbarang = req.body.barang;
    const { penerima } = req.body;
    const { qty } = req.body;
    const namabarangKeluar = await stok.getNama(idbarang);
    const penginput = req.session.user.email;
    const kodebarangKeluar = await stok.getKode(idbarang);

    const stock = await stok.getStock(idbarang);
    const newStock = parseInt(stock, 10) - parseInt(qty, 10);

    if (newStock < 0) {
      const barangKeluar = await bkeluar.getBarangK();
      const barang = await stok.getBarang();
      res.render('barangKeluar', {
        us: req.session.user.email,
        title: 'Barang Keluar',
        brgk: barangKeluar,
        moment,
        error: 'Tambah barang keluar gagal: stok barang tidak mencukupi.',
        brg: barang,
      });
    } else {
      await stok.updateStock(newStock, idbarang);
      await bkeluar.addBarangKeluar(
        idbarang,
        penerima,
        qty,
        namabarangKeluar,
        penginput,
        kodebarangKeluar,
      );

      res.redirect('/barangkeluar');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const updateBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { idbarang } = req.body;
    const { penerima } = req.body;
    const { qty } = req.body;
    const { idkeluar } = req.body;

    const stockk = await stok.getStock(idbarang);
    if (stockk !== 'undefined') {
      const currentQtyy = await bkeluar.getQty(idkeluar);

      const qtyy = parseInt(qty, 10);
      const currentQty = parseInt(currentQtyy, 10);

      if (qtyy > currentQty) {
        const selisih = qtyy - currentQty;
        const kurangin = stockk - selisih;
        if (kurangin < 0) {
          const barangKeluar = await bkeluar.getBarangK();
          const barang = await stok.getBarang();
          res.render('barangKeluar', {
            user: req.session.user.email,
            title: 'Barang Keluar',
            brgk: barangKeluar,
            moment,
            error:
              'Edit barang keluar gagal: menambah jumlah keluar barang ini akan mengakibatkan nilai stok barang menjadi negatif.',
            brg: barang,
          });
        } else {
          await stok.updateStock(kurangin, idbarang);
          await bkeluar.updateBarangKeluar(penerima, qty, idkeluar);
          res.redirect('/barangkeluar');
        }
      } else {
        const selisih = currentQty - qtyy;
        const tambahin = stockk + selisih;
        await stok.updateStock(tambahin, idbarang);
        await bkeluar.updateBarangKeluar(penerima, qty, idkeluar);
        res.redirect('/barangkeluar');
      }
    } else {
      await bkeluar.updateBarangKeluar(penerima, qty, idkeluar);
      res.redirect('/barangkeluar');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const deleteBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { idbarang } = req.body;
    const { qty } = req.body;
    const { idkeluar } = req.body;

    const stockk = await stok.getStock(idbarang);
    if (stockk !== 'undefined') {
      const qtyy = parseInt(qty, 10);
      const stock = parseInt(stockk, 10);

      const selisih = stock + qtyy;

      await stok.updateStock(selisih, idbarang);
      await bkeluar.delBarangKeluar(idkeluar);

      res.redirect('/barangkeluar');
    } else {
      await bkeluar.delBarangKeluar(idkeluar);

      res.redirect('/barangkeluar');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getBarangKeluar,
  addBarangKeluar,
  updateBarangKeluar,
  deleteBarangKeluar,
};
