import { body, param, query, validationResult } from "express-validator"
import { createError } from "../utils/errorUtil.mjs"

// Middleware para verificar errores de validación
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(createError(400, errors.array()[0].msg))
  }
  next()
}

// Validaciones para registro de usuario
export const registerValidation = [
  body("email").isEmail().withMessage("Ingrese un email válido").normalizeEmail().trim(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[a-zA-Z]/)
    .withMessage("La contraseña debe contener al menos una letra"),
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  validateRequest,
]

// Validaciones para inicio de sesión
export const loginValidation = [
  body("email").isEmail().withMessage("Ingrese un email válido").normalizeEmail().trim(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  validateRequest,
]

// Validaciones para creación de perfil
export const createProfileValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre del perfil es obligatorio")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  body("type").isIn(["adult", "teen", "child"]).withMessage("El tipo de perfil debe ser adult, teen o child"),
  // body("avatar").optional().isURL().withMessage("La URL del avatar no es válida"),
  body("avatar").optional().custom((value) => {
    // Permitir URLs válidas o rutas locales que terminen en una imagen
    const isValidUrl = /^(https?:\/\/)/.test(value);
    const isLocalPath = /\.(png|jpe?g|gif|svg)$/.test(value);
    if (!isValidUrl && !isLocalPath) {
      throw new Error("La ruta del avatar debe ser una URL o una ruta de imagen válida");
    }
    return true;
  }),
  validateRequest,
]

// Validaciones para actualización de perfil
export const updateProfileValidation = [
  param("id").isMongoId().withMessage("ID de perfil no válido"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  body("type")
    .optional()
    .isIn(["adult", "teen", "child"])
    .withMessage("El tipo de perfil debe ser adult, teen o child"),
  body("avatar").optional().isURL().withMessage("La URL del avatar no es válida"),
  validateRequest,
]

// Validaciones para operaciones de watchlist
export const watchlistValidation = [
  param("id").isMongoId().withMessage("ID de perfil no válido"),
  body("movieId").isMongoId().withMessage("ID de película no válido"),
  validateRequest,
]

// Validaciones para obtener películas
export const getMoviesValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("La página debe ser un número entero positivo"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("El límite debe ser un número entero entre 1 y 50"),
  query("genre").optional().isString().withMessage("El género debe ser una cadena de texto"),
  query("profileType")
    .optional()
    .isIn(["adult", "teen", "child"])
    .withMessage("El tipo de perfil debe ser adult, teen o child"),
  validateRequest,
]

// Validaciones para búsqueda de películas
export const searchMoviesValidation = [
  query("query")
    .notEmpty()
    .withMessage("El término de búsqueda es obligatorio")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El término de búsqueda debe tener al menos 2 caracteres"),
  validateRequest,
]

// Validaciones para creación de película
export const createMovieValidation = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El título debe tener entre 1 y 100 caracteres"),
  body("overview")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .trim()
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),
  body("rating")
    .isIn(["G", "PG", "PG-13", "R", "NC-17"])
    .withMessage("La clasificación debe ser G, PG, PG-13, R o NC-17"),
  body("genres")
    .custom((value) => {
      if (!value) {
        throw new Error("Debe proporcionar al menos un género")
      }
      const genres = Array.isArray(value) ? value : [value]
  
      if (genres.length === 0) {
        throw new Error("Debe proporcionar al menos un género")
      }
  
      if (!genres.every((genre) => typeof genre === "string" && genre.trim().length > 0)) {
        throw new Error("Todos los géneros deben ser cadenas de texto no vacías")
      }

      return true
    }),
  body("tmdbId").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("El ID de TMDB debe ser un número entero positivo"),
  body("releaseDate").optional().isISO8601().withMessage("La fecha de lanzamiento debe tener un formato válido"),
  body("duration").optional().isInt({ min: 1 }).withMessage("La duración debe ser un número entero positivo"),
  body("posterPath").optional().isURL().withMessage("La URL del póster no es válida"),
  body("backdropPath").optional().isURL().withMessage("La URL del fondo no es válida"),
  body("trailerUrl").optional().isURL().withMessage("La URL del trailer no es válida"),
  validateRequest,
]

// Validaciones para actualización de película
export const updateMovieValidation = [
  param("id").isMongoId().withMessage("ID de película no válido"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("El título debe tener entre 1 y 100 caracteres"),
  body("overview")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),
  body("rating")
    .optional()
    .isIn(["G", "PG", "PG-13", "R", "NC-17"])
    .withMessage("La clasificación debe ser G, PG, PG-13, R o NC-17"),
  body("genres")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar al menos un género")
    .custom((genres) => {
      if (!genres.every((genre) => typeof genre === "string" && genre.trim().length > 0)) {
        throw new Error("Todos los géneros deben ser cadenas de texto no vacías")
      }
      return true
    }),
  body("tmdbId").optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage("El ID de TMDB debe ser un número entero positivo"),
  body("releaseDate").optional().isISO8601().withMessage("La fecha de lanzamiento debe tener un formato válido"),
  body("duration").optional().isInt({ min: 1 }).withMessage("La duración debe ser un número entero positivo"),
  body("posterPath").optional().isURL().withMessage("La URL del póster no es válida"),
  body("backdropPath").optional().isURL().withMessage("La URL del fondo no es válida"),
  body("trailerUrl").optional().isURL().withMessage("La URL del trailer no es válida"),
  validateRequest,
]
