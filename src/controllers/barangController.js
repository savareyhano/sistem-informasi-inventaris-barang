const { promisify } = require("util");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
const QRCode = require("qrcode");
const multer = require("multer");
const path = require("path");
// const { createCanvas } = require("canvas");
// const JsBarcode = require("jsbarcode");
const stok = require("../queries/stockBarangQuery");
const bmasuk = require("../queries/barangMasukQuery");
const bkeluar = require("../queries/barangKeluarQuery");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Delete File
const unlinkAsync = promisify(fs.unlink);

// Canvas
// const canvas = createCanvas();

exports.getBarang = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const barang = await stok.getBarang();
    res.render("barang", {
      user: req.session.user.email,
      title: "Stok Barang",
      brg: barang,
    });
  } else if (req.session.user && req.session.user.role === "user") {
    const barang = await stok.getBarang();
    res.render("barang", {
      us: req.session.user.email,
      title: "Stok Barang",
      brg: barang,
    });
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.getBarangDetail = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const barang = await stok.getDetail(req.params.id);
    const barangMasuk = await bmasuk.getDetailBarang(req.params.id);
    const barangKeluar = await bkeluar.getDetailBarang(req.params.id);

    res.render("barangDetail", {
      brg: barang,
      user: req.session.user.email,
      title: "Detail Barang",
      brgm: barangMasuk,
      brgk: barangKeluar,
      moment,
    });
  } else if (req.session.user && req.session.user.role === "user") {
    const barang = await stok.getDetail(req.params.id);
    const barangMasuk = await bmasuk.getDetailBarang(req.params.id);
    const barangKeluar = await bkeluar.getDetailBarang(req.params.id);

    res.render("barangDetail", {
      brg: barang,
      us: req.session.user.email,
      title: "Detail Barang",
      brgm: barangMasuk,
      brgk: barangKeluar,
      moment,
    });
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.addBarang = [
  upload.single("image"),
  body("kodebarang").custom(async (value) => {
    const dup = await stok.cekKode(value.toLowerCase());
    if (dup) {
      throw new Error("Tambah barang gagal: kode barang sudah ada.");
    }
    return true;
  }),
  body("namabarang").custom(async (value) => {
    const duplicate = await stok.cekBarang(value.toLowerCase());
    if (duplicate) {
      throw new Error("Tambah barang gagal: nama barang sudah ada.");
    }
    return true;
  }),
  body("image").custom(async (value, { req }) => {
    const maxSize = 1048576;
    if (req.file.size > maxSize) {
      throw new Error("Tambah barang gagal: ukuran file melebihi batas 1MB.");
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === "superadmin") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let img = req.file.filename;

        pth = "./public/uploads/" + img;
        if (fs.existsSync(pth)) {
          await unlinkAsync(pth);
        }

        const barang = await stok.getBarang();

        res.render("barang", {
          title: "Stok Barang",
          errors: errors.array(),
          user: req.session.user.email,
          brg: barang,
        });
      } else {
        let namabarang = req.body.namabarang;
        let deskripsi = req.body.deskripsi;
        let stock = req.body.stock;
        let image = req.file.filename;
        let penginput = req.session.user.email;
        let kodebarang = req.body.kodebarang;

        await stok.addBarang(
          namabarang,
          deskripsi,
          stock,
          image,
          penginput,
          kodebarang
        );

        // JsBarcode(canvas, kodebarang);
        // const buffer = canvas.toBuffer("image/png");
        pat = "./public/uploads/" + kodebarang + ".png";
        // fs.writeFileSync(pat, buffer);
        QRCode.toFile(pat, kodebarang, function (err) {
          if (err) return console.log(err);
        });

        res.redirect("/barang");
      }
    } else if (req.session.user && req.session.user.role === "user") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let img = req.file.filename;

        pth = "./public/uploads/" + img;
        if (fs.existsSync(pth)) {
          await unlinkAsync(pth);
        }

        const barang = await stok.getBarang();

        res.render("barang", {
          title: "Stok Barang",
          errors: errors.array(),
          us: req.session.user.email,
          brg: barang,
        });
      } else {
        let namabarang = req.body.namabarang;
        let deskripsi = req.body.deskripsi;
        let stock = req.body.stock;
        let image = req.file.filename;
        let penginput = req.session.user.email;
        let kodebarang = req.body.kodebarang;

        await stok.addBarang(
          namabarang,
          deskripsi,
          stock,
          image,
          penginput,
          kodebarang
        );

        // JsBarcode(canvas, kodebarang);
        // const buffer = canvas.toBuffer("image/png");
        pat = "./public/uploads/" + kodebarang + ".png";
        // fs.writeFileSync(pat, buffer);
        QRCode.toFile(pat, kodebarang, function (err) {
          if (err) return console.log(err);
        });

        res.redirect("/barang");
      }
    } else {
      res.status(401);
      res.render("401", { title: "401 Error" });
    }
  },
];

exports.updateBarang = [
  upload.single("image"),
  body("kodebarang").custom(async (value, { req }) => {
    const dup = await stok.checkKodeDuplicate(value.toLowerCase());
    if (value !== req.body.oldKode && dup) {
      throw new Error("Edit barang gagal: kode barang sudah ada.");
    }
    return true;
  }),
  body("namabarang").custom(async (value, { req }) => {
    const duplicate = await stok.checkDuplicate(value.toLowerCase());
    if (value !== req.body.oldNama && duplicate) {
      throw new Error("Edit barang gagal: nama barang sudah ada.");
    }
    return true;
  }),
  body("image").custom(async (value, { req }) => {
    const maxSize = 1048576;
    if (req.file) {
      if (req.file.size > maxSize) {
        throw new Error("Edit barang gagal: ukuran file melebihi batas 1MB.");
      }
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === "superadmin") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file) {
          if (req.file.filename) {
            let img = req.file.filename;

            pth = "./public/uploads/" + img;
            if (fs.existsSync(pth)) {
              await unlinkAsync(pth);
            }
          }
        }
        const barang = await stok.getBarang();

        res.render("barang", {
          title: "Stok Barang",
          errors: errors.array(),
          brg: barang,
          user: req.session.user.email,
        });
      } else {
        if (req.file) {
          if (req.file.filename) {
            let namabarang = req.body.namabarang;
            let deskripsi = req.body.deskripsi;
            let stock = req.body.stock;
            let image = req.file.filename;
            let kodebarang = req.body.kodebarang;
            let oldKode = req.body.oldKode;
            let idbarang = req.body.idbarang;
            let img = req.body.image;

            await stok.updateBarang(
              namabarang,
              deskripsi,
              stock,
              image,
              kodebarang,
              idbarang
            );

            pth = "./public/uploads/" + img;
            if (fs.existsSync(pth)) {
              await unlinkAsync(pth);
            }

            if (kodebarang != oldKode) {
              pat = "./public/uploads/" + oldKode + ".png";
              if (fs.existsSync(pat)) {
                await unlinkAsync(pat);
              }

              // JsBarcode(canvas, kodebarang);
              // const buffer = canvas.toBuffer("image/png");
              pat = "./public/uploads/" + kodebarang + ".png";
              // fs.writeFileSync(pat, buffer);
              QRCode.toFile(pat, kodebarang, function (err) {
                if (err) return console.log(err);
              });
            }

            res.redirect("/barang");
          }
        } else {
          let namabarang = req.body.namabarang;
          let deskripsi = req.body.deskripsi;
          let stock = req.body.stock;
          let image = req.body.image;
          let kodebarang = req.body.kodebarang;
          let oldKode = req.body.oldKode;
          let idbarang = req.body.idbarang;

          await stok.updateBarang(
            namabarang,
            deskripsi,
            stock,
            image,
            kodebarang,
            idbarang
          );

          if (kodebarang != oldKode) {
            pat = "./public/uploads/" + oldKode + ".png";
            if (fs.existsSync(pat)) {
              await unlinkAsync(pat);
            }

            // JsBarcode(canvas, kodebarang);
            // const buffer = canvas.toBuffer("image/png");
            pat = "./public/uploads/" + kodebarang + ".png";
            // fs.writeFileSync(pat, buffer);
            QRCode.toFile(pat, kodebarang, function (err) {
              if (err) return console.log(err);
            });
          }

          res.redirect("/barang");
        }
      }
    } else {
      res.status(401);
      res.render("401", { title: "401 Error" });
    }
  },
];

exports.deleteBarang = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const image = await stok.getImage(req.params.id);
    const kode = await stok.getKode(req.params.id);
    const nama = await stok.getNama(req.params.id);
    await stok.delBarang(req.params.id);
    // await bmasuk.delBarangMasukId(req.params.id);
    // await bkeluar.delBarangKeluarId(req.params.id);
    pth = "./public/uploads/" + image;
    if (fs.existsSync(pth)) {
      await unlinkAsync(pth);
    }
    pat = "./public/uploads/" + kode + ".png";
    if (fs.existsSync(pat)) {
      await unlinkAsync(pat);
    }
    res.redirect("/barang");
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};
