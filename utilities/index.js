// utilities/index.js
const invModel = require("../models/inventory-model");
const Util = {};

/* -------------------------------------------------------
 * Build navigation bar from classification data
 * ----------------------------------------------------- */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* -------------------------------------------------------
 * Build classification grid for the listing view
 * ----------------------------------------------------- */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* -------------------------------------------------------
 * Build vehicle detail HTML
 * ----------------------------------------------------- */
Util.buildVehicleDetail = async function (vehicle) {
  let detail = '<div id="vehicle-detail">';
  detail +=
    '<img src="' +
    vehicle.inv_image +
    '" alt="Image of ' +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    '">';
  detail += '<div id="vehicle-info">';
  detail +=
    "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + " Details</h2>";
  detail += "<ul>";
  detail +=
    "<li><strong>Price:</strong> $" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</li>";
  detail += "<li><strong>Year:</strong> " + vehicle.inv_year + "</li>";
  detail +=
    "<li><strong>Miles:</strong> " +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>";
  detail += "<li><strong>Color:</strong> " + vehicle.inv_color + "</li>";
  detail +=
    "<li><strong>Description:</strong> " + vehicle.inv_description + "</li>";
  detail += "</ul>";
  detail += "</div>";
  detail += "</div>";
  return detail;
};

/* -------------------------------------------------------
 * Task 3 – Build Classification <select> list
 * classification_id param used to pre-select (stickiness)
 * ----------------------------------------------------- */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* -------------------------------------------------------
 * Error handling middleware wrapper
 * ----------------------------------------------------- */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
