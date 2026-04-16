// models/account-model.js
const pool = require("../database/");

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM public.account WHERE account_email = $1",
      [account_email],
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Return account data using account_id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account WHERE account_id = $1",
      [account_id]
    );
    return result; // return full result, not result.rows[0]
  } catch (error) {
    return new Error("No matching account found");
  }
}

/* *****************************
 * Register new account
 * ***************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
) {
  try {
    const sql =
      "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Check for existing email
 * ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
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


module.exports = {
  getAccountByEmail,
  getAccountById,
  registerAccount,
  checkExistingEmail,
  updateAccount,
  updatePassword,
};
