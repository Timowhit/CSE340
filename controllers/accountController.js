// controllers/accountController.js
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const { buildManagement } = require("./invController");
const pool = require("../database");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  req.flash("notice");
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    );
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
    return;
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Successful login — extend with JWT in a future activity
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
      res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }

  const jwt = require("jsonwebtoken");

  const payload = {
    account_id: account.account_id,
    account_firstname: account.account_firstname,
    account_type: account.account_type,
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, { httpOnly: true });
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

async function buildUpdateView(req, res) {
  const account_id = req.params.account_id;

  const data = await accountModel.getAccountById(account_id);

  if (!data.rows.length) {
    req.flash("notice", "Account not found");
    return res.redirect("/account");
  }

  res.render("account/update", {
    title: "Update Account",
    account_id: data.rows[0].account_id,
    account_firstname: data.rows[0].account_firstname,
    account_lastname: data.rows[0].account_lastname,
    account_email: data.rows[0].account_email,
  });
}

async function updateAccount(firstname, lastname, email, account_id) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
  `;
  return await pool.query(sql, [firstname, lastname, email, account_id]);
}

async function updatePassword(hashedPassword, account_id) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
  `;
  return await pool.query(sql, [hashedPassword, account_id]);
}

function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
};
