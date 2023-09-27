const moment = require("moment");
const stok = require("../queries/stockBarangQuery");
const bmasuk = require("../queries/barangMasukQuery");

exports.getBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const barangMasuk = await bmasuk.getBarangM();
    const barang = await stok.getBarang();
    res.render("barangMasuk", {
      user: req.session.user.email,
      title: "Barang Masuk",
      brgm: barangMasuk,
      moment,
      brg: barang,
    });
  } else if (req.session.user && req.session.user.role === "user") {
    const barangMasuk = await bmasuk.getBarangM();
    const barang = await stok.getBarang();
    res.render("barangMasuk", {
      us: req.session.user.email,
      title: "Barang Masuk",
      brgm: barangMasuk,
      moment,
      brg: barang,
    });
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.addBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    let idbarang = req.body.barang;
    let keterangan = req.body.keterangan;
    let qty = req.body.qty;
    let namabarang_m = await stok.getNama(idbarang);
    let penginput = req.session.user.email;
    let kodebarang_m = await stok.getKode(idbarang);

    stock = await stok.getStock(idbarang);
    newStock = parseInt(stock) + parseInt(qty);

    await stok.updateStock(newStock, idbarang);
    await bmasuk.addBarangMasuk(
      idbarang,
      keterangan,
      qty,
      namabarang_m,
      penginput,
      kodebarang_m
    );

    res.redirect("/barangmasuk");
  } else if (req.session.user && req.session.user.role === "user") {
    let idbarang = req.body.barang;
    let keterangan = req.body.keterangan;
    let qty = req.body.qty;
    let namabarang_m = await stok.getNama(idbarang);
    let penginput = req.session.user.email;
    let kodebarang_m = await stok.getKode(idbarang);

    stock = await stok.getStock(idbarang);
    newStock = parseInt(stock) + parseInt(qty);

    await stok.updateStock(newStock, idbarang);
    await bmasuk.addBarangMasuk(
      idbarang,
      keterangan,
      qty,
      namabarang_m,
      penginput,
      kodebarang_m
    );

    res.redirect("/barangmasuk");
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.updateBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    let idbarang = req.body.idbarang;
    let keterangan = req.body.keterangan;
    let qty = req.body.qty;
    let idmasuk = req.body.idmasuk;

    stockk = await stok.getStock(idbarang);
    if (stockk != "undefined") {
      currentQtyy = await bmasuk.getQty(idmasuk);

      qtyy = parseInt(qty);
      stock = parseInt(stockk);
      currentQty = parseInt(currentQtyy);

      if (qtyy > currentQty) {
        selisih = qtyy - currentQty;
        tambahin = stockk + selisih;
        await stok.updateStock(tambahin, idbarang);
        await bmasuk.updateBarangMasuk(keterangan, qty, idmasuk);
        res.redirect("/barangmasuk");
      } else {
        selisih = currentQty - qtyy;
        kurangin = stockk - selisih;
        if (kurangin < 0) {
          const barangMasuk = await bmasuk.getBarangM();
          const barang = await stok.getBarang();
          res.render("barangMasuk", {
            user: req.session.user.email,
            title: "Barang Masuk",
            brgm: barangMasuk,
            moment,
            deleteFail:
              "Edit barang masuk gagal: mengurangi jumlah masuk barang ini akan mengakibatkan nilai stok barang menjadi negatif.",
            brg: barang,
          });
        } else {
          await stok.updateStock(kurangin, idbarang);
          await bmasuk.updateBarangMasuk(keterangan, qty, idmasuk);
          res.redirect("/barangmasuk");
        }
      }
    } else {
      await bmasuk.updateBarangMasuk(keterangan, qty, idmasuk);
      res.redirect("/barangmasuk");
    }
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.deleteBarangMasuk = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    let idbarang = req.body.idbarang;
    let qty = req.body.qty;
    let idmasuk = req.body.idmasuk;

    stockk = await stok.getStock(idbarang);
    if (stockk != "undefined") {
      qtyy = parseInt(qty);
      stock = parseInt(stockk);

      selisih = stock - qtyy;

      if (selisih < 0) {
        const barangMasuk = await bmasuk.getBarangM();
        const barang = await stok.getBarang();
        res.render("barangMasuk", {
          user: req.session.user.email,
          title: "Barang Masuk",
          brgm: barangMasuk,
          moment,
          deleteFail:
            "Hapus barang masuk gagal: menghapus barang masuk ini akan mengakibatkan nilai stok barang menjadi negatif.",
          brg: barang,
        });
      } else {
        await stok.updateStock(selisih, idbarang);
        await bmasuk.delBarangMasuk(idmasuk);

        res.redirect("/barangmasuk");
      }
    } else {
      await bmasuk.delBarangMasuk(idmasuk);

      res.redirect("/barangmasuk");
    }
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};
