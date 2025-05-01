import express from "express"
import {
  getProfilesController,
  createProfileController,
  updateProfileController,
  deleteProfileController,
} from "../controllers/profileController.mjs"
import { verifyToken } from "../middlewares/authMiddleware.mjs"

const router = express.Router()

// Todas las rutas están protegidas
router.use(verifyToken)

// Rutas de perfil
router.get("/", getProfilesController)
// router.get("/:id", )
router.post("/", createProfileController)
router.put("/:id", updateProfileController)
router.delete("/:id", deleteProfileController)

export default router
