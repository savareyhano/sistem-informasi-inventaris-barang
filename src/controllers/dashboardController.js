const user = require("../queries/userQuery");
const stok = require("../queries/stockBarangQuery");
const bmasuk = require("../queries/barangMasukQuery");
const bkeluar = require("../queries/barangKeluarQuery");

exports.getIndex = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const totalStock = await stok.totalStock();
    const totalQtyBM = await bmasuk.totalQty();
    const totalQtyBK = await bkeluar.totalQty();
    const totalUsers = await user.totalUsers();
    res.render("index", {
      user: req.session.user.email,
      title: "Dasbor",
      totalStock: totalStock,
      totalQtyBM: totalQtyBM,
      totalQtyBK: totalQtyBK,
      totalUsers: totalUsers,
    });
  } else if (req.session.user && req.session.user.role === "user") {
    const totalStock = await stok.totalStock();
    const totalQtyBM = await bmasuk.totalQty();
    const totalQtyBK = await bkeluar.totalQty();
    const totalUsers = await user.totalUsers();
    res.render("index", {
      us: req.session.user.email,
      title: "Dasbor",
      totalStock: totalStock,
      totalQtyBM: totalQtyBM,
      totalQtyBK: totalQtyBK,
      totalUsers: totalUsers,
    });
  } else {
    res.render("login", { title: "Login" });
  }
};
