import express from "express"
import { register, login, getCurrentUser } from "../controllers/authController.mjs"
import { verifyToken } from "../middlewares/authMiddleware.mjs"

const router = express.Router()

// Rutas públicas
router.post("/register", register)
router.post("/login", login)

// Rutas protegidas
router.get("/me", verifyToken, getCurrentUser)

export default router