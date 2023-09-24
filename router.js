var express = require("express");
var router = express.Router();
const methodOverride = require("method-override");
const morgan = require("morgan");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { createCanvas } = require("canvas");
const JsBarcode = require("jsbarcode");
const QRCode = require("qrcode");
const user = require("./queries/userQuery");
const stok = require("./queries/stockBarangQuery");
const bmasuk = require("./queries/barangMasukQuery");
const bkeluar = require("./queries/barangKeluarQuery");
const log = require("./queries/logQuery");

// Method Override
router.use(methodOverride("_method"));

// Morgan
const custom = (tokens, req, res) => {
  if (req.session) {
    if (req.session.superadmin) {
      const usr = req.session.superadmin;
      const method = tokens.method(req, res);
      const endpoint = tokens.url(req, res);
      const statusCode = tokens.status(req, res);

      log.addLog(usr, method, endpoint, statusCode);
    } else if (req.session.user) {
      const usr = req.session.user;
      const method = tokens.method(req, res);
      const endpoint = tokens.url(req, res);
      const statusCode = tokens.status(req, res);

      log.addLog(usr, method, endpoint, statusCode);
    }
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  }
};

router.use(morgan(custom));

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
const canvas = createCanvas();

// login user
router.post("/login", async (req, res) => {
  email = req.body.email;
  password = req.body.password;

  checkPass = await bcrypt.compare(password, await user.checkPassword(email));

  if (
    email == (await user.email(email)) &&
    checkPass &&
    (await user.checkRole(email)) == "superadmin"
  ) {
    req.session.superadmin = email;
    res.redirect("/");
  } else if (
    email == (await user.email(email)) &&
    checkPass &&
    (await user.checkRole(email)) == "user"
  ) {
    req.session.user = email;
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Login",
      loginFail: "Email atau kata sandi salah.",
    });
  }
});

router.get("/", async (req, res) => {
  if (req.session.superadmin) {
    const totalStock = await stok.totalStock();
    const totalQtyBM = await bmasuk.totalQty();
    const totalQtyBK = await bkeluar.totalQty();
    const totalUsers = await user.totalUsers();
    res.render("index", {
      user: req.session.superadmin,
      title: "Dasbor",
      totalStock: totalStock,
      totalQtyBM: totalQtyBM,
      totalQtyBK: totalQtyBK,
      totalUsers: totalUsers,
    });
  } else if (req.session.user) {
    const totalStock = await stok.totalStock();
    const totalQtyBM = await bmasuk.totalQty();
    const totalQtyBK = await bkeluar.totalQty();
    const totalUsers = await user.totalUsers();
    res.render("index", {
      us: req.session.user,
      title: "Dasbor",
      totalStock: totalStock,
      totalQtyBM: totalQtyBM,
      totalQtyBK: totalQtyBK,
      totalUsers: totalUsers,
    });
  } else {
    res.render("login", { title: "Login" });
  }
});

router.get("/users", async (req, res) => {
  if (req.session.superadmin) {
    const users = await user.getUsers();
    res.render("user", {
      usr: users,
      user: req.session.superadmin,
      title: "Kelola Pengguna",
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post(
  "/users",
  body("email").custom(async (value) => {
    const duplicate = await user.email2(value.toLowerCase());
    if (duplicate) {
      throw new Error("Tambah pengguna gagal: email sudah ada.");
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.superadmin) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const users = await user.getUsers();
        res.render("user", {
          title: "Kelola Pengguna",
          errors: errors.array(),
          usr: users,
          user: req.session.superadmin,
        });
      } else {
        let email = req.body.email;
        let password = await bcrypt.hash(req.body.password, 10);
        let role = req.body.role;

        await user.addUser(email, password, role);

        res.redirect("/users");
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.put(
  "/users/:id",
  body("email").custom(async (value, { req }) => {
    const duplicate = await user.checkDuplicate(value.toLowerCase());
    if (value !== req.body.oldEmail && duplicate) {
      throw new Error("Edit pengguna gagal: email sudah ada.");
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.superadmin) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const users = await user.getUsers();
        res.render("user", {
          title: "Kelola Pengguna",
          errors: errors.array(),
          usr: users,
          user: req.session.superadmin,
        });
      } else {
        await user.updateUser(req.body);
        res.redirect("/users");
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.post("/users/delete/:id", async (req, res) => {
  if (req.session.superadmin) {
    await user.delUser(req.params.id);
    res.redirect("/users");
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post("/users/resetpassword/:id", async (req, res) => {
  if (req.session.superadmin) {
    password = await bcrypt.hash("password", 10);
    await user.updatePassword(password, req.params.id);
    const users = await user.getUsers();
    res.render("user", {
      usr: users,
      user: req.session.superadmin,
      title: "Kelola Pengguna",
      resetSuccess: "Reset kata sandi berhasil.",
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.get("/account", async (req, res) => {
  if (req.session.superadmin) {
    const users = await user.checkProfile(req.session.superadmin);
    res.render("account", {
      usr: users,
      user: req.session.superadmin,
      title: "Edit Akun",
    });
  } else if (req.session.user) {
    const users = await user.checkProfile(req.session.user);
    res.render("account", {
      usr: users,
      us: req.session.user,
      title: "Edit Akun",
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.put(
  "/account/changeemail",
  body("email").custom(async (value, { req }) => {
    const duplicate = await user.checkDuplicate(value.toLowerCase());
    if (value == req.body.oldEmail) {
      throw new Error(
        "Ganti email gagal: email baru tidak boleh sama dengan email sekarang."
      );
    }
    if (duplicate) {
      throw new Error("Ganti email gagal: email sudah ada.");
    }
    return true;
  }),
  body("password").custom(async (value, { req }) => {
    checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error("Ganti email gagal: kata sandi salah.");
    }
    return true;
  }),
  async (req, res) => {
    if (
      req.session.superadmin &&
      req.session.superadmin !== "superadmin@gmail.com"
    ) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("account", {
          title: "Akun",
          errors: errors.array(),
          usr: req.body,
          user: req.session.superadmin,
        });
      } else {
        await user.updateEmail(req.body);
        req.session.destroy(function (err) {
          if (err) {
            console.log(err);
            res.send("Error");
          } else {
            res.render("login", {
              title: "Login",
              logout: "Ganti email berhasil, silahkan masuk kembali.",
            });
          }
        });
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.put(
  "/account/changepassword",
  body("oldPassword").custom(async (value, { req }) => {
    checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error("Ganti kata sandi gagal: kata sandi lama salah.");
    }
    return true;
  }),
  body("password").custom(async (value, { req }) => {
    checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (checkPass) {
      throw new Error(
        "Ganti kata sandi gagal: kata sandi baru tidak boleh sama dengan kata sandi lama."
      );
    }
    return true;
  }),
  body("confirmPassword").custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        "Ganti kata sandi gagal: kata sandi baru dan konfirmasi kata sandi baru tidak cocok."
      );
    }
    return true;
  }),
  async (req, res) => {
    if (req.session.superadmin) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("account", {
          title: "Akun",
          errors: errors.array(),
          usr: req.body,
          user: req.session.superadmin,
        });
      } else {
        let password = await bcrypt.hash(req.body.password, 10);
        let id = req.body.id;

        await user.updatePassword(password, id);
        req.session.destroy(function (err) {
          if (err) {
            console.log(err);
            res.send("Error");
          } else {
            res.render("login", {
              title: "Login",
              logout: "Ganti kata sandi berhasil, silahkan masuk kembali.",
            });
          }
        });
      }
    } else if (req.session.user) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("account", {
          title: "Akun",
          errors: errors.array(),
          usr: req.body,
          us: req.session.user,
        });
      } else {
        let password = await bcrypt.hash(req.body.password, 10);
        let id = req.body.id;

        await user.updatePassword(password, id);
        req.session.destroy(function (err) {
          if (err) {
            console.log(err);
            res.send("Error");
          } else {
            res.render("login", {
              title: "Login",
              logout: "Ganti kata sandi berhasil, silahkan masuk kembali.",
            });
          }
        });
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.put(
  "/account/changerole",
  body("password").custom(async (value, { req }) => {
    checkPass = await bcrypt.compare(value, req.body.matchPass);
    if (!checkPass) {
      throw new Error("Ganti role gagal: kata sandi salah.");
    }
    return true;
  }),
  async (req, res) => {
    if (
      req.session.superadmin &&
      req.session.superadmin !== "superadmin@gmail.com"
    ) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("account", {
          title: "Akun",
          errors: errors.array(),
          usr: req.body,
          user: req.session.superadmin,
        });
      } else {
        await user.updateRole(req.body);
        req.session.destroy(function (err) {
          if (err) {
            console.log(err);
            res.send("Error");
          } else {
            res.render("login", {
              title: "Login",
              logout: "Ganti role berhasil, silahkan masuk kembali.",
            });
          }
        });
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.get("/barang", async (req, res) => {
  if (req.session.superadmin) {
    const barang = await stok.getBarang();
    res.render("barang", {
      user: req.session.superadmin,
      title: "Stok Barang",
      brg: barang,
    });
  } else if (req.session.user) {
    const barang = await stok.getBarang();
    res.render("barang", {
      us: req.session.user,
      title: "Stok Barang",
      brg: barang,
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.get("/barang/:id", async (req, res) => {
  if (req.session.superadmin) {
    const barang = await stok.getDetail(req.params.id);
    const barangMasuk = await bmasuk.getDetailBarang(req.params.id);
    const barangKeluar = await bkeluar.getDetailBarang(req.params.id);

    res.render("barangDetail", {
      brg: barang,
      user: req.session.superadmin,
      title: "Detail Barang",
      brgm: barangMasuk,
      brgk: barangKeluar,
      moment,
    });
  } else if (req.session.user) {
    const barang = await stok.getDetail(req.params.id);
    const barangMasuk = await bmasuk.getDetailBarang(req.params.id);
    const barangKeluar = await bkeluar.getDetailBarang(req.params.id);

    res.render("barangDetail", {
      brg: barang,
      us: req.session.user,
      title: "Detail Barang",
      brgm: barangMasuk,
      brgk: barangKeluar,
      moment,
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post(
  "/barang",
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
    if (req.session.superadmin) {
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
          user: req.session.superadmin,
          brg: barang,
        });
      } else {
        let namabarang = req.body.namabarang;
        let deskripsi = req.body.deskripsi;
        let stock = req.body.stock;
        let image = req.file.filename;
        let penginput = req.session.superadmin;
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
        pat = "./public/uploads/" + kodebarang + " - " + namabarang + ".png";
        // fs.writeFileSync(pat, buffer);
        QRCode.toFile(pat, kodebarang + " - " + namabarang, function (err) {
          if (err) return console.log(err);
        });

        res.redirect("/barang");
      }
    } else if (req.session.user) {
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
          us: req.session.user,
          brg: barang,
        });
      } else {
        let namabarang = req.body.namabarang;
        let deskripsi = req.body.deskripsi;
        let stock = req.body.stock;
        let image = req.file.filename;
        let penginput = req.session.user;
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
        pat = "./public/uploads/" + kodebarang + " - " + namabarang + ".png";
        // fs.writeFileSync(pat, buffer);
        QRCode.toFile(pat, kodebarang + " - " + namabarang, function (err) {
          if (err) return console.log(err);
        });

        res.redirect("/barang");
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.put(
  "/barang/:id",
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
    if (req.session.superadmin) {
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
          user: req.session.superadmin,
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
              pat = "./public/uploads/" + oldKode + " - " + namabarang + ".png";
              if (fs.existsSync(pat)) {
                await unlinkAsync(pat);
              }

              // JsBarcode(canvas, kodebarang);
              // const buffer = canvas.toBuffer("image/png");
              pat =
                "./public/uploads/" + kodebarang + " - " + namabarang + ".png";
              // fs.writeFileSync(pat, buffer);
              QRCode.toFile(
                pat,
                kodebarang + " - " + namabarang,
                function (err) {
                  if (err) return console.log(err);
                }
              );
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
            pat = "./public/uploads/" + oldKode + " - " + namabarang + ".png";
            if (fs.existsSync(pat)) {
              await unlinkAsync(pat);
            }

            // JsBarcode(canvas, kodebarang);
            // const buffer = canvas.toBuffer("image/png");
            pat =
              "./public/uploads/" + kodebarang + " - " + namabarang + ".png";
            // fs.writeFileSync(pat, buffer);
            QRCode.toFile(pat, kodebarang + " - " + namabarang, function (err) {
              if (err) return console.log(err);
            });
          }

          res.redirect("/barang");
        }
      }
    } else {
      res.status(401);
      res.render("error_page/401", { title: "401 Error" });
    }
  }
);

router.post("/barang/delete/:id", async (req, res) => {
  if (req.session.superadmin) {
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
    pat = "./public/uploads/" + kode + " - " + nama + ".png";
    if (fs.existsSync(pat)) {
      await unlinkAsync(pat);
    }
    res.redirect("/barang");
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.get("/barangmasuk", async (req, res) => {
  if (req.session.superadmin) {
    const barangMasuk = await bmasuk.getBarangM();
    const barang = await stok.getBarang();
    res.render("barangMasuk", {
      user: req.session.superadmin,
      title: "Barang Masuk",
      brgm: barangMasuk,
      moment,
      brg: barang,
    });
  } else if (req.session.user) {
    const barangMasuk = await bmasuk.getBarangM();
    const barang = await stok.getBarang();
    res.render("barangMasuk", {
      us: req.session.user,
      title: "Barang Masuk",
      brgm: barangMasuk,
      moment,
      brg: barang,
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post("/barangmasuk", async (req, res) => {
  if (req.session.superadmin) {
    let idbarang = req.body.barang;
    let keterangan = req.body.keterangan;
    let qty = req.body.qty;
    let namabarang_m = await stok.getNama(idbarang);
    let penginput = req.session.superadmin;
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
  } else if (req.session.user) {
    let idbarang = req.body.barang;
    let keterangan = req.body.keterangan;
    let qty = req.body.qty;
    let namabarang_m = await stok.getNama(idbarang);
    let penginput = req.session.user;
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
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.put("/barangmasuk/:id", async (req, res) => {
  if (req.session.superadmin) {
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
            user: req.session.superadmin,
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
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post("/barangmasuk/delete/:id", async (req, res) => {
  if (req.session.superadmin) {
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
          user: req.session.superadmin,
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
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.get("/barangkeluar", async (req, res) => {
  if (req.session.superadmin) {
    const barangKeluar = await bkeluar.getBarangK();
    const barang = await stok.getBarang();
    res.render("barangKeluar", {
      user: req.session.superadmin,
      title: "Barang Keluar",
      brgk: barangKeluar,
      moment,
      brg: barang,
    });
  } else if (req.session.user) {
    const barangKeluar = await bkeluar.getBarangK();
    const barang = await stok.getBarang();
    res.render("barangKeluar", {
      us: req.session.user,
      title: "Barang Keluar",
      brgk: barangKeluar,
      moment,
      brg: barang,
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post("/barangkeluar", async (req, res) => {
  if (req.session.superadmin) {
    let idbarang = req.body.barang;
    let penerima = req.body.penerima;
    let qty = req.body.qty;
    let namabarang_k = await stok.getNama(idbarang);
    let penginput = req.session.superadmin;
    let kodebarang_k = await stok.getKode(idbarang);

    stock = await stok.getStock(idbarang);
    newStock = parseInt(stock) - parseInt(qty);

    if (newStock < 0) {
      const barangKeluar = await bkeluar.getBarangK();
      const barang = await stok.getBarang();
      res.render("barangKeluar", {
        user: req.session.superadmin,
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
  } else if (req.session.user) {
    let idbarang = req.body.barang;
    let penerima = req.body.penerima;
    let qty = req.body.qty;
    let namabarang_k = await stok.getNama(idbarang);
    let penginput = req.session.user;
    let kodebarang_k = await stok.getKode(idbarang);

    stock = await stok.getStock(idbarang);
    newStock = parseInt(stock) - parseInt(qty);

    if (newStock < 0) {
      const barangKeluar = await bkeluar.getBarangK();
      const barang = await stok.getBarang();
      res.render("barangKeluar", {
        us: req.session.user,
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
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.put("/barangkeluar/:id", async (req, res) => {
  if (req.session.superadmin) {
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
            user: req.session.superadmin,
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
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post("/barangkeluar/delete/:id", async (req, res) => {
  if (req.session.superadmin) {
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
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.get("/log", async (req, res) => {
  if (req.session.superadmin) {
    const logs = await log.getLog();
    res.render("log", {
      log: logs,
      user: req.session.superadmin,
      title: "Log Aplikasi",
      moment,
    });
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

router.post("/log/delete", async (req, res) => {
  if (req.session.superadmin) {
    await log.delLog();
    res.redirect("/log");
  } else {
    res.status(401);
    res.render("error_page/401", { title: "401 Error" });
  }
});

// route for logout
router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("login", { title: "Login", logout: "Keluar berhasil." });
    }
  });
});

module.exports = router;
