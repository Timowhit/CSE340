const db = require('../database')

/* Get all vehicles by classification name */
async function getVehiclesByClassification(classification_name) {
  const data = await db.query(
    `SELECT * FROM public.inventory AS i
     JOIN public.classification AS c
       ON i.classification_id = c.classification_id
     WHERE c.classification_name = $1`,
    [classification_name]
  )
  return data.rows
}

/* Get a single vehicle by inventory id */
async function getVehicleById(inv_id) {
  const data = await db.query(
    `SELECT * FROM public.inventory WHERE inv_id = $1`,
    [inv_id]
  )
  return data.rows[0]
}

module.exports = { getVehiclesByClassification, getVehicleById }