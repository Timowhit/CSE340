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
async function accountLogin(req, res, next) {
  console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET);
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login", nav, errors: null, account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      const jwt = require("jsonwebtoken");
      const token = jwt.sign(
        {
          account_id: accountData.account_id,
          account_firstname: accountData.account_firstname,
          account_type: accountData.account_type,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", token, { httpOnly: true });
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login", nav, errors: null, account_email,
      });
    }
  } catch (error) {
    next(error);
  }
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

async function updateAccount(req, res, next) {
  const { firstname, lastname, email, account_id } = req.body;
  await accountModel.updateAccount(firstname, lastname, email, account_id);
  req.flash("notice", "Account updated successfully.");
  res.redirect("/account/");
}

async function updatePassword(req, res, next) {
  const { password, account_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await accountModel.updatePassword(hashedPassword, account_id);
  req.flash("notice", "Password updated successfully.");
  res.redirect("/account/");
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
