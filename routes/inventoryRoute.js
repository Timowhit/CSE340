const express = require('express')
const router = express.Router()
const invController = require('../controllers/invController')

// Classification view
router.get('/type/:classification', invController.buildByClassification)

// Vehicle detail view  (Task 1)
router.get('/detail/:inv_id', invController.buildDetail)

// Intentional error trigger  (Task 3)
router.get('/cause-error', invController.triggerError)

module.exports = router