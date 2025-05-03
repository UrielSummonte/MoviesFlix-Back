import express from "express"
import {
  getProfilesController,
  createProfileController,
  updateProfileController,
  deleteProfileController,
} from "../controllers/profileController.mjs"
import { verifyToken } from "../middlewares/authMiddleware.mjs"
import { createProfileValidation, updateProfileValidation } from "../middlewares/validationMiddleware.mjs"

const router = express.Router()

// Todas las rutas están protegidas
router.use(verifyToken)

// Rutas de perfil
router.get("/", getProfilesController)
// router.get("/:id", )
router.post("/", createProfileValidation, createProfileController)
router.put("/:id", updateProfileValidation, updateProfileController)
router.delete("/:id", deleteProfileController)

export default router
