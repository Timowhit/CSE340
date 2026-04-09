// models/inventory-model.js
const pool = require("../database/");

/* -------------------------------------------------------
 * Get all classifications
 * ----------------------------------------------------- */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name",
  );
}

/* -------------------------------------------------------
 * Get inventory items by classification_id
 * ----------------------------------------------------- */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id],
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* -------------------------------------------------------
 * Get a single inventory item by inv_id
 * ----------------------------------------------------- */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,
      [inv_id],
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error: " + error);
  }
}

/* -------------------------------------------------------
 * Task 2 – Insert a new classification
 * ----------------------------------------------------- */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* -------------------------------------------------------
 * Task 3 – Insert a new inventory item
 * ----------------------------------------------------- */
async function addInventory(
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
) {
  try {
    const sql = `
      INSERT INTO public.inventory
        (classification_id, inv_make, inv_model, inv_year, inv_description,
         inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;

    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
};
