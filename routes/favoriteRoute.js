const express = require("express")
const router = express.Router()
const favoriteController = require("../controllers/favoriteController")
const { checkJWT } = require("../middleware/auth")

router.use(checkJWT)

router.get("/", favoriteController.buildFavorites)
router.post("/add", favoriteController.addFavorite)
router.get("/delete/:favorite_id", favoriteController.deleteFavorite)

module.exports = router