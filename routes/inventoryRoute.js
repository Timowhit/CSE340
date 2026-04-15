// routes/inventoryRoute.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const { checkEmployeeOrAdmin } = require("../middleware/auth");

/* ===================================
 * Validation Rule Arrays
 * =================================== */

// Classification validation rules
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name must not contain spaces or special characters.",
      ),
  ];
};

// Inventory validation rules
const inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    body("inv_model")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Please provide a valid 4-digit year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image").trim().notEmpty().withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .notEmpty()
      .isDecimal()
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a whole number."),

    body("inv_color")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters."),
  ];
};

// Middleware to check validation result
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      notice: null,
    });
    return;
  }
  next();
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
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

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList =
      await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      classificationList,
      notice: null,
      // Sticky values
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
    return;
  }
  next();
};

router.get("/", checkEmployeeOrAdmin, invController.buildManagement);
router.get(
  "/add-classification",
  checkEmployeeOrAdmin,
  invController.buildAddClassification,
);
router.get(
  "/add-inventory",
  checkEmployeeOrAdmin,
  invController.buildAddInventory,
);

/* ===================================
 * Routes
 * =================================== */
// Public browsing routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId),
);

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId),
);

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Add classification – GET
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification),
);

// Add classification – POST
router.post(
  "/add-classification",
  classificationRules(),
  checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

// Add inventory – GET
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory),
);

// Add inventory – POST
router.post(
  "/add-inventory",
  inventoryRules(),
  checkInventoryData,
  utilities.handleErrors(invController.addInventory),
);

module.exports = router;
