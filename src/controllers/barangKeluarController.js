const moment = require("moment");
const stok = require("../queries/stockBarangQuery");
const bkeluar = require("../queries/barangKeluarQuery");

exports.getBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const barangKeluar = await bkeluar.getBarangK();
    const barang = await stok.getBarang();
    res.render("barangKeluar", {
      user: req.session.user.email,
      title: "Barang Keluar",
      brgk: barangKeluar,
      moment,
      brg: barang,
    });
  } else if (req.session.user && req.session.user.role === "user") {
    const barangKeluar = await bkeluar.getBarangK();
    const barang = await stok.getBarang();
    res.render("barangKeluar", {
      us: req.session.user.email,
      title: "Barang Keluar",
      brgk: barangKeluar,
      moment,
      brg: barang,
    });
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.addBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    let idbarang = req.body.barang;
    let penerima = req.body.penerima;
    let qty = req.body.qty;
    let namabarang_k = await stok.getNama(idbarang);
    let penginput = req.session.user.email;
    let kodebarang_k = await stok.getKode(idbarang);

    stock = await stok.getStock(idbarang);
    newStock = parseInt(stock) - parseInt(qty);

    if (newStock < 0) {
      const barangKeluar = await bkeluar.getBarangK();
      const barang = await stok.getBarang();
      res.render("barangKeluar", {
        user: req.session.user.email,
        title: "Barang Keluar",
        brgk: barangKeluar,
        moment,
        error: "Tambah barang keluar gagal: stok barang tidak mencukupi.",
        brg: barang,
      });
    } else {
      await stok.updateStock(newStock, idbarang);
      await bkeluar.addBarangKeluar(
        idbarang,
        penerima,
        qty,
        namabarang_k,
        penginput,
        kodebarang_k
      );

      res.redirect("/barangkeluar");
    }
  } else if (req.session.user && req.session.user.role === "user") {
    let idbarang = req.body.barang;
    let penerima = req.body.penerima;
    let qty = req.body.qty;
    let namabarang_k = await stok.getNama(idbarang);
    let penginput = req.session.user.email;
    let kodebarang_k = await stok.getKode(idbarang);

    stock = await stok.getStock(idbarang);
    newStock = parseInt(stock) - parseInt(qty);

    if (newStock < 0) {
      const barangKeluar = await bkeluar.getBarangK();
      const barang = await stok.getBarang();
      res.render("barangKeluar", {
        us: req.session.user.email,
        title: "Barang Keluar",
        brgk: barangKeluar,
        moment,
        error: "Tambah barang keluar gagal: stok barang tidak mencukupi.",
        brg: barang,
      });
    } else {
      await stok.updateStock(newStock, idbarang);
      await bkeluar.addBarangKeluar(
        idbarang,
        penerima,
        qty,
        namabarang_k,
        penginput,
        kodebarang_k
      );

      res.redirect("/barangkeluar");
    }
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.updateBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    let idbarang = req.body.idbarang;
    let penerima = req.body.penerima;
    let qty = req.body.qty;
    let idkeluar = req.body.idkeluar;

    stockk = await stok.getStock(idbarang);
    if (stockk != "undefined") {
      currentQtyy = await bkeluar.getQty(idkeluar);

      qtyy = parseInt(qty);
      stock = parseInt(stockk);
      currentQty = parseInt(currentQtyy);

      if (qtyy > currentQty) {
        selisih = qtyy - currentQty;
        kurangin = stockk - selisih;
        if (kurangin < 0) {
          const barangKeluar = await bkeluar.getBarangK();
          const barang = await stok.getBarang();
          res.render("barangKeluar", {
            user: req.session.user.email,
            title: "Barang Keluar",
            brgk: barangKeluar,
            moment,
            error:
              "Edit barang keluar gagal: menambah jumlah keluar barang ini akan mengakibatkan nilai stok barang menjadi negatif.",
            brg: barang,
          });
        } else {
          await stok.updateStock(kurangin, idbarang);
          await bkeluar.updateBarangKeluar(penerima, qty, idkeluar);
          res.redirect("/barangkeluar");
        }
      } else {
        selisih = currentQty - qtyy;
        tambahin = stockk + selisih;
        await stok.updateStock(tambahin, idbarang);
        await bkeluar.updateBarangKeluar(penerima, qty, idkeluar);
        res.redirect("/barangkeluar");
      }
    } else {
      await bkeluar.updateBarangKeluar(penerima, qty, idkeluar);
      res.redirect("/barangkeluar");
    }
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.deleteBarangKeluar = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    let idbarang = req.body.idbarang;
    let qty = req.body.qty;
    let idkeluar = req.body.idkeluar;

    stockk = await stok.getStock(idbarang);
    if (stockk != "undefined") {
      qtyy = parseInt(qty);
      stock = parseInt(stockk);

      selisih = stock + qtyy;

      await stok.updateStock(selisih, idbarang);
      await bkeluar.delBarangKeluar(idkeluar);

      res.redirect("/barangkeluar");
    } else {
      await bkeluar.delBarangKeluar(idkeluar);

      res.redirect("/barangkeluar");
    }
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};
