const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

/* ----------------------------------------
   Build classification view
   ---------------------------------------- */
const buildByClassification = async function (req, res, next) {
  try {
    const classification_name = req.params.classification
    const data = await invModel.getVehiclesByClassification(classification_name)
    const grid = await utilities.buildClassificationGrid(data)
    const className = classification_name.charAt(0).toUpperCase() + classification_name.slice(1)
    res.render('inventory/classification', {
      title: `${className} Vehicles | CSE Motors`,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ----------------------------------------
   Build detail view  (Task 1)
   ---------------------------------------- */
const buildDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const vehicle = await invModel.getVehicleById(inv_id)
    if (!vehicle) {
      const err = new Error('Vehicle not found')
      err.status = 404
      return next(err)
    }
    const detailHTML = utilities.buildVehicleDetail(vehicle)
    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model} | CSE Motors`,
      detailHTML,
    })
  } catch (error) {
    next(error)
  }
}

/* ----------------------------------------
   Intentional 500 error trigger  (Task 3)
   ---------------------------------------- */
const triggerError = async function (req, res, next) {
  try {
    throw new Error('Intentional 500 error triggered for testing.')
  } catch (error) {
    error.status = 500
    next(error)
  }
}

module.exports = { buildByClassification, buildDetail, triggerError }