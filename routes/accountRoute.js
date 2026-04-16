// routes/accountRoute.js
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Deliver login view – GET /account/login
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver registration view – GET /account/register
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration),
);

// Deliver account management view – GET /account/   ← FIX #3
router.get(
  "/",
  utilities.handleErrors(accountController.buildAccountManagement),
);

// Process registration – POST /account/register
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

// Process login – POST /account/login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

router.get("/update/:account_id", accountController.buildUpdateView);

router.post("/update", accountController.updateAccount);

router.post("/password", accountController.updatePassword);

router.get("/logout", accountController.logout);

module.exports = router;
