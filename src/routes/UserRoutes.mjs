import express from "express"
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.mjs"

const router = express.Router()

// Todas las rutas están protegidas
router.use(verifyToken)

// Obtener usuario actual (ya implementado en el controlador de auth)
router.get("/me", (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  })
})

// Rutas de admin
router.use(verifyAdmin)

// Admin puede obtener todos los usuarios (se implementaría en un controlador de usuario)
router.get("/", (req, res) => {
  res.status(501).json({ message: "No implementado aún" })
})

export default router
