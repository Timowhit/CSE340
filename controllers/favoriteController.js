const favoriteModel = require("../models/favorite-model")

async function addFavorite(req, res) {
  try {
    const { inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    await favoriteModel.addFavorite(account_id, inv_id)

    req.flash("notice", "Added to favorites!")
    res.redirect("/favorites")
  } catch (err) {
    req.flash("notice", "Error adding favorite")
    res.redirect("/inv")
  }
}

async function buildFavorites(req, res) {
  try {
    const account_id = res.locals.accountData.account_id
    const data = await favoriteModel.getFavoritesByAccount(account_id)
    const utilities = require("../utilities/")
    let nav = await utilities.getNav()

    res.render("favorites/list", {
      title: "My Favorites",
      nav,
      favorites: data.rows
    })
  } catch (err) {
    req.flash("notice", "Error loading favorites")
    res.redirect("/account")
  }
}

async function deleteFavorite(req, res) {
  try {
    await favoriteModel.deleteFavorite(req.params.favorite_id)

    req.flash("notice", "Removed from favorites")
    res.redirect("/favorites")
  } catch (err) {
    req.flash("notice", "Error removing favorite")
    res.redirect("/favorites")
  }
}

module.exports = {
  addFavorite,
  buildFavorites,
  deleteFavorite
}