const { promisify } = require('util');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const QRCode = require('qrcode');
const multer = require('multer');
const path = require('path');
// const { createCanvas } = require("canvas");
// const JsBarcode = require("jsbarcode");
const stok = require('../queries/stockBarangQuery');
const bmasuk = require('../queries/barangMasukQuery');
const bkeluar = require('../queries/barangKeluarQuery');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Delete File
const unlinkAsync = promisify(fs.unlink);

// Canvas
// const canvas = createCanvas();

const getBarang = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const barang = await stok.getBarang();
    res.render('barang', {
      user: req.session.user.email,
      title: 'Stok Barang',
      brg: barang,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const barang = await stok.getBarang();
    res.render('barang', {
      us: req.session.user.email,
      title: 'Stok Barang',
      brg: barang,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const getBarangDetail = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const barang = await stok.getDetail(req.params.id);
    const barangMasuk = await bmasuk.getDetailBarang(req.params.id);
    const barangKeluar = await bkeluar.getDetailBarang(req.params.id);

    res.render('barangDetail', {
      brg: barang,
      user: req.session.user.email,
      title: 'Detail Barang',
      brgm: barangMasuk,
      brgk: barangKeluar,
      moment,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const barang = await stok.getDetail(req.params.id);
    const barangMasuk = await bmasuk.getDetailBarang(req.params.id);
    const barangKeluar = await bkeluar.getDetailBarang(req.params.id);

    res.render('barangDetail', {
      brg: barang,
      us: req.session.user.email,
      title: 'Detail Barang',
      brgm: barangMasuk,
      brgk: barangKeluar,
      moment,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const addBarang = [
  upload.single('image'),
  body('kodebarang').custom(async (value) => {
    const dup = await stok.cekKode(value.toLowerCase());
    if (dup) {
      throw new Error('Tambah barang gagal: kode barang sudah ada.');
    }
    return true;
  }),
  body('namabarang').custom(async (value) => {
    const duplicate = await stok.cekBarang(value.toLowerCase());
    if (duplicate) {
      throw new Error('Tambah barang gagal: nama barang sudah ada.');
    }
    return true;
  }),
  body('image').custom(async (value, { req }) => {
    const maxSize = 1048576;
    if (req.file.size > maxSize) {
      throw new Error('Tambah barang gagal: ukuran file melebihi batas 1MB.');
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const img = req.file.filename;

        const imgPath = `./public/uploads/${img}`;
        if (fs.existsSync(imgPath)) {
          await unlinkAsync(imgPath);
        }

        const barang = await stok.getBarang();

        res.render('barang', {
          title: 'Stok Barang',
          errors: errors.array(),
          user: req.session.user.email,
          brg: barang,
        });
      } else {
        const { namabarang } = req.body;
        const { deskripsi } = req.body;
        const { stock } = req.body;
        const image = req.file.filename;
        const penginput = req.session.user.email;
        const { kodebarang } = req.body;

        await stok.addBarang(
          namabarang,
          deskripsi,
          stock,
          image,
          penginput,
          kodebarang,
        );

        // JsBarcode(canvas, kodebarang);
        // const buffer = canvas.toBuffer("image/png");
        const writeImgPath = `./public/uploads/${kodebarang}.png`;
        // fs.writeFileSync(writeImgPath, buffer);
        QRCode.toFile(writeImgPath, kodebarang, (err) => {
          if (err) {
            console.err(err);
            return false;
          }
          return true;
        });

        res.redirect('/barang');
      }
    } else if (req.session.user && req.session.user.role === 'user') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const img = req.file.filename;

        const imgPath = `./public/uploads/${img}`;
        if (fs.existsSync(imgPath)) {
          await unlinkAsync(imgPath);
        }

        const barang = await stok.getBarang();

        res.render('barang', {
          title: 'Stok Barang',
          errors: errors.array(),
          us: req.session.user.email,
          brg: barang,
        });
      } else {
        const { namabarang } = req.body;
        const { deskripsi } = req.body;
        const { stock } = req.body;
        const image = req.file.filename;
        const penginput = req.session.user.email;
        const { kodebarang } = req.body;

        await stok.addBarang(
          namabarang,
          deskripsi,
          stock,
          image,
          penginput,
          kodebarang,
        );

        // JsBarcode(canvas, kodebarang);
        // const buffer = canvas.toBuffer("image/png");
        const writeImgPath = `./public/uploads/${kodebarang}.png`;
        // fs.writeFileSync(writeImgPath, buffer);
        QRCode.toFile(writeImgPath, kodebarang, (err) => {
          if (err) {
            console.err(err);
            return false;
          }
          return true;
        });

        res.redirect('/barang');
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const updateBarang = [
  upload.single('image'),
  body('kodebarang').custom(async (value, { req }) => {
    const dup = await stok.checkKodeDuplicate(value.toLowerCase());
    if (value !== req.body.oldKode && dup) {
      throw new Error('Edit barang gagal: kode barang sudah ada.');
    }
    return true;
  }),
  body('namabarang').custom(async (value, { req }) => {
    const duplicate = await stok.checkDuplicate(value.toLowerCase());
    if (value !== req.body.oldNama && duplicate) {
      throw new Error('Edit barang gagal: nama barang sudah ada.');
    }
    return true;
  }),
  body('image').custom(async (value, { req }) => {
    const maxSize = 1048576;
    if (req.file) {
      if (req.file.size > maxSize) {
        throw new Error('Edit barang gagal: ukuran file melebihi batas 1MB.');
      }
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.user && req.session.user.role === 'superadmin') {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.file && req.file.filename) {
          const img = req.file.filename;

          const imgPath = `./public/uploads/${img}`;
          if (fs.existsSync(imgPath)) {
            await unlinkAsync(imgPath);
          }
        }
        const barang = await stok.getBarang();

        res.render('barang', {
          title: 'Stok Barang',
          errors: errors.array(),
          brg: barang,
          user: req.session.user.email,
        });
      } else if (req.file && req.file.filename) {
        const { namabarang } = req.body;
        const { deskripsi } = req.body;
        const { stock } = req.body;
        const image = req.file.filename;
        const { kodebarang } = req.body;
        const { oldKode } = req.body;
        const { idbarang } = req.body;
        const img = req.body.image;

        await stok.updateBarang(
          namabarang,
          deskripsi,
          stock,
          image,
          kodebarang,
          idbarang,
        );

        const imgPath = `./public/uploads/${img}`;
        if (fs.existsSync(imgPath)) {
          await unlinkAsync(imgPath);
        }

        if (kodebarang !== oldKode) {
          const oldImgPath = `./public/uploads/${oldKode}.png`;
          if (fs.existsSync(oldImgPath)) {
            await unlinkAsync(oldImgPath);
          }

          // JsBarcode(canvas, kodebarang);
          // const buffer = canvas.toBuffer("image/png");
          const writeImgPath = `./public/uploads/${kodebarang}.png`;
          // fs.writeFileSync(writeImgPath, buffer);
          QRCode.toFile(writeImgPath, kodebarang, (err) => {
            if (err) {
              console.err(err);
              return false;
            }
            return true;
          });
        }

        res.redirect('/barang');
      } else {
        const { namabarang } = req.body;
        const { deskripsi } = req.body;
        const { stock } = req.body;
        const { image } = req.body;
        const { kodebarang } = req.body;
        const { oldKode } = req.body;
        const { idbarang } = req.body;

        await stok.updateBarang(
          namabarang,
          deskripsi,
          stock,
          image,
          kodebarang,
          idbarang,
        );

        if (kodebarang !== oldKode) {
          const oldImgPath = `./public/uploads/${oldKode}.png`;
          if (fs.existsSync(oldImgPath)) {
            await unlinkAsync(oldImgPath);
          }

          // JsBarcode(canvas, kodebarang);
          // const buffer = canvas.toBuffer("image/png");
          const writeImgPath = `./public/uploads/${kodebarang}.png`;
          // fs.writeFileSync(writeImgPath, buffer);
          QRCode.toFile(writeImgPath, kodebarang, (err) => {
            if (err) {
              console.err(err);
              return false;
            }
            return true;
          });
        }

        res.redirect('/barang');
      }
    } else {
      res.status(401);
      res.render('401', { title: '401 Error' });
    }
  },
];

const deleteBarang = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const image = await stok.getImage(req.params.id);
    const kode = await stok.getKode(req.params.id);
    await stok.delBarang(req.params.id);
    // await bmasuk.delBarangMasukId(req.params.id);
    // await bkeluar.delBarangKeluarId(req.params.id);
    const imgPath = `./public/uploads/${image}`;
    if (fs.existsSync(imgPath)) {
      await unlinkAsync(imgPath);
    }
    const writeImgPath = `./public/uploads/${kode}.png`;
    if (fs.existsSync(writeImgPath)) {
      await unlinkAsync(writeImgPath);
    }
    res.redirect('/barang');
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getBarang,
  getBarangDetail,
  addBarang,
  updateBarang,
  deleteBarang,
};
