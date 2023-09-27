const moment = require("moment");
const log = require("../queries/logQuery");

exports.getLog = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    const logs = await log.getLog();
    res.render("log", {
      log: logs,
      user: req.session.user.email,
      title: "Log Aplikasi",
      moment,
    });
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};

exports.deleteLog = async (req, res) => {
  if (req.session.user && req.session.user.role === "superadmin") {
    await log.delLog();
    res.redirect("/log");
  } else {
    res.status(401);
    res.render("401", { title: "401 Error" });
  }
};
