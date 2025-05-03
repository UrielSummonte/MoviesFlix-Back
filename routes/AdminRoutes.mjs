import express from "express"
import {
  renderAdminPanelController,
  renderAddMovieControlle,
  renderEditMovieController,
  addMovieController,
  updateMovieController,
  deleteMovieController,
  getUserStatsController,
  renderLoginForm,
  renderRegisterFormController,
  adminLoginController,
  adminLogoutController,
  register
} from "../controllers/adminController.mjs"
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.mjs"
import { createMovieValidation, updateMovieValidation } from "../middlewares/validationMiddleware.mjs"

const router = express.Router()

// Rutas de autenticación de administrador (FUERA del middleware de protección)
router.get("/login", renderLoginForm)
router.post("/login", adminLoginController)
router.get("/register", renderRegisterFormController); // <-- Agrega aquí tu nueva vista de registro
router.post("/register", register); 
router.get("/logout", adminLogoutController)

// Middleware para proteger las DEMÁS rutas de administrador (DESPUÉS de las rutas de login)
router.use((req, res, next) => {
  console.log(`Middleware activado para la ruta: ${req.path}, método: ${req.method}`);

  // Verificar token desde cookie
  const token = req.cookies.admin_token;
  console.log(`Token encontrado en cookies: ${token}`);

  if (!token) {
    console.log("No se encontró token, redirigiendo a /admin/login");
    return res.redirect("/admin/login");
  }

  // Usar middleware de autenticación
  verifyToken(req, res, (err) => {
    if (err) {
      console.log(`Error en verifyToken: ${err}`);
      return res.redirect("/admin/login");
    }
    verifyAdmin(req, res, (err) => {
      if (err) {
        console.log(`Error en verifyAdmin: ${err}`);
        return res.redirect("/admin/login");
      }
      console.log("Middleware completado, pasando al siguiente handler");
      next();
    });
  });
});

// Rutas del panel de administración
router.get("/", renderAdminPanelController)
router.get("/addMovie", renderAddMovieControlle)
router.get("/editMovie/:id", renderEditMovieController)
router.post("/movies", createMovieValidation, addMovieController)
router.put("/movies/:id", updateMovieValidation, updateMovieController)
router.delete("/movies/:id", deleteMovieController)
router.get("/userStats", getUserStatsController)

export default router