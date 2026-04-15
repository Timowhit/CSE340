const jwt = require("jsonwebtoken");

function checkJWT(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.locals.accountData = decoded;
      res.locals.loggedin = true;
    } catch (err) {
      res.locals.loggedin = false;
      res.locals.accountData = null;
    }
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
  }

  next();
}

function checkEmployeeOrAdmin(req, res, next) {
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  const type = res.locals.accountData.account_type;

  if (type === "Employee" || type === "Admin") {
    return next();
  }

  req.flash("notice", "Access denied.");
  return res.redirect("/account/login");
}

module.exports = { checkJWT, checkEmployeeOrAdmin };
