const moment = require('moment');
const stok = require('../queries/stockBarangQuery');
const bmasuk = require('../queries/barangMasukQuery');

const getBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const barangMasuk = await bmasuk.getBarangM();
    const barang = await stok.getBarang();
    res.render('barangMasuk', {
      user: req.session.user.email,
      title: 'Barang Masuk',
      brgm: barangMasuk,
      moment,
      brg: barang,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const barangMasuk = await bmasuk.getBarangM();
    const barang = await stok.getBarang();
    res.render('barangMasuk', {
      us: req.session.user.email,
      title: 'Barang Masuk',
      brgm: barangMasuk,
      moment,
      brg: barang,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const addBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const idbarang = req.body.barang;
    const { keterangan } = req.body;
    const { qty } = req.body;
    const namabarangMasuk = await stok.getNama(idbarang);
    const penginput = req.session.user.email;
    const kodebarangMasuk = await stok.getKode(idbarang);

    const stock = await stok.getStock(idbarang);
    const newStock = parseInt(stock, 10) + parseInt(qty, 10);

    await stok.updateStock(newStock, idbarang);
    await bmasuk.addBarangMasuk(
      idbarang,
      keterangan,
      qty,
      namabarangMasuk,
      penginput,
      kodebarangMasuk,
    );

    res.redirect('/barangmasuk');
  } else if (req.session.user && req.session.user.role === 'user') {
    const idbarang = req.body.barang;
    const { keterangan } = req.body;
    const { qty } = req.body;
    const namabarangMasuk = await stok.getNama(idbarang);
    const penginput = req.session.user.email;
    const kodebarangMasuk = await stok.getKode(idbarang);

    const stock = await stok.getStock(idbarang);
    const newStock = parseInt(stock, 10) + parseInt(qty, 10);

    await stok.updateStock(newStock, idbarang);
    await bmasuk.addBarangMasuk(
      idbarang,
      keterangan,
      qty,
      namabarangMasuk,
      penginput,
      kodebarangMasuk,
    );

    res.redirect('/barangmasuk');
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const updateBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { idbarang } = req.body;
    const { keterangan } = req.body;
    const { qty } = req.body;
    const { idmasuk } = req.body;

    const stockk = await stok.getStock(idbarang);
    if (stockk !== 'undefined') {
      const currentQtyy = await bmasuk.getQty(idmasuk);

      const qtyy = parseInt(qty, 10);
      const currentQty = parseInt(currentQtyy, 10);

      if (qtyy > currentQty) {
        const selisih = qtyy - currentQty;
        const tambahin = stockk + selisih;
        await stok.updateStock(tambahin, idbarang);
        await bmasuk.updateBarangMasuk(keterangan, qty, idmasuk);
        res.redirect('/barangmasuk');
      } else {
        const selisih = currentQty - qtyy;
        const kurangin = stockk - selisih;
        if (kurangin < 0) {
          const barangMasuk = await bmasuk.getBarangM();
          const barang = await stok.getBarang();
          res.render('barangMasuk', {
            user: req.session.user.email,
            title: 'Barang Masuk',
            brgm: barangMasuk,
            moment,
            deleteFail:
              'Edit barang masuk gagal: mengurangi jumlah masuk barang ini akan mengakibatkan nilai stok barang menjadi negatif.',
            brg: barang,
          });
        } else {
          await stok.updateStock(kurangin, idbarang);
          await bmasuk.updateBarangMasuk(keterangan, qty, idmasuk);
          res.redirect('/barangmasuk');
        }
      }
    } else {
      await bmasuk.updateBarangMasuk(keterangan, qty, idmasuk);
      res.redirect('/barangmasuk');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const deleteBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { idbarang } = req.body;
    const { qty } = req.body;
    const { idmasuk } = req.body;

    const stockk = await stok.getStock(idbarang);
    if (stockk !== 'undefined') {
      const qtyy = parseInt(qty, 10);
      const stock = parseInt(stockk, 10);

      const selisih = stock - qtyy;

      if (selisih < 0) {
        const barangMasuk = await bmasuk.getBarangM();
        const barang = await stok.getBarang();
        res.render('barangMasuk', {
          user: req.session.user.email,
          title: 'Barang Masuk',
          brgm: barangMasuk,
          moment,
          deleteFail:
            'Hapus barang masuk gagal: menghapus barang masuk ini akan mengakibatkan nilai stok barang menjadi negatif.',
          brg: barang,
        });
      } else {
        await stok.updateStock(selisih, idbarang);
        await bmasuk.delBarangMasuk(idmasuk);

        res.redirect('/barangmasuk');
      }
    } else {
      await bmasuk.delBarangMasuk(idmasuk);

      res.redirect('/barangmasuk');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getBarangMasuk,
  addBarangMasuk,
  updateBarangMasuk,
  deleteBarangMasuk,
};
