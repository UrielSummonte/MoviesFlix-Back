import express from "express"
import { register, login, getCurrentUser } from "../controllers/authController.mjs"
import { verifyToken } from "../middlewares/authMiddleware.mjs"
import { registerValidation, loginValidation } from "../middlewares/validationMiddleware.mjs"

const router = express.Router()

// Rutas públicas
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)

// Rutas protegidas
router.get("/me", verifyToken, getCurrentUser)

export default router