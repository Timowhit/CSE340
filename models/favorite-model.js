const pool = require("../database")

// Add favorite
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    RETURNING *
  `
  return await pool.query(sql, [account_id, inv_id])
}

// Get favorites
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT f.favorite_id, i.*
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
  `
  return await pool.query(sql, [account_id])
}

// Remove favorite
async function deleteFavorite(favorite_id) {
  const sql = `
    DELETE FROM favorites
    WHERE favorite_id = $1
  `
  return await pool.query(sql, [favorite_id])
}

module.exports = {
  addFavorite,
  getFavoritesByAccount,
  deleteFavorite
}