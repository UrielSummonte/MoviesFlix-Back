import express from "express"
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "../controllers/watchlistController.mjs"
import { verifyToken } from "../middlewares/authMiddleware.mjs"

const router = express.Router()

// Todas las rutas están protegidas
router.use(verifyToken)

// Rutas de watchlist
router.get("/:profileId", getWatchlist)
router.post("/:profileId/movies/:movieId", addToWatchlist)
router.delete("/:profileId/movies/:movieId", removeFromWatchlist)

export default router
