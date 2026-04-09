const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");

router.get("/", async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("index", { title: "CSE Motors | Home", nav });
});

module.exports = router;
