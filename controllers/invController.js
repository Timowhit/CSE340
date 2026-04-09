// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* -------------------------------------------------------
 * Build inventory by classification view
 * ----------------------------------------------------- */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* -------------------------------------------------------
 * Build vehicle detail view
 * ----------------------------------------------------- */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getInventoryById(inv_id);
  const detail = await utilities.buildVehicleDetail(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
    errors: null,
  });
};

/* -------------------------------------------------------
 * Task 1 – Deliver management view
 * ----------------------------------------------------- */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const notice = req.flash("notice");
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    notice,
    errors: null,
  });
};

/* -------------------------------------------------------
 * Task 2 – Deliver add-classification view (GET)
 * ----------------------------------------------------- */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const notice = req.flash("notice");
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    notice,
    errors: null,
  });
};

/* -------------------------------------------------------
 * Task 2 – Process new classification (POST)
 * ----------------------------------------------------- */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const result = await invModel.addClassification(classification_name);

  if (result) {
    // Rebuild nav so the new classification appears immediately
    let nav = await utilities.getNav();
    const notice = req.flash(
      "notice",
      `"${classification_name}" classification was successfully added.`,
    );
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the classification could not be added.");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav: await utilities.getNav(),
      notice: req.flash("notice"),
      errors: null,
    });
  }
};

/* -------------------------------------------------------
 * Task 3 – Deliver add-inventory view (GET)
 * ----------------------------------------------------- */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const notice = req.flash("notice");
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    notice,
    errors: null,
  });
};

/* -------------------------------------------------------
 * Task 3 – Process new inventory item (POST)
 * ----------------------------------------------------- */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  );

  if (result) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`,
    );
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      notice: req.flash("notice"),
      errors: null,
    });
  } else {
    let nav = await utilities.getNav();
    let classificationList =
      await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, the vehicle could not be added.");
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      notice: req.flash("notice"),
      errors: null,
      // Sticky values returned on failure
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
  }
};

module.exports = invCont;
