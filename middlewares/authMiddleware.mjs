import jwt from "jsonwebtoken"
import { createError } from "../utils/errorUtil.mjs"
import UserRepository from "../repositories/UserRepository.mjs"
import ProfileRepository from "../repositories/ProfileRepository.mjs"

// Verificar si el usuario está autenticado
export const verifyToken = async (req, res, next) => {
  try {
    // Obtener token del header o de las cookies
    let token
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Token desde header
      token = authHeader.split(" ")[1]
    } else if (req.cookies && req.cookies.admin_token) {
      // Token desde cookie
      token = req.cookies.admin_token
    }

    if (!token) {
      return next(createError(401, "No se proporcionó token de autenticación"))
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar usuario
    const user = await UserRepository.findUserById(decoded.id)

    if (!user) {
      return next(createError(404, "Usuario no encontrado"))
    }

    // Agregar usuario a la solicitud
    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(401, "Token inválido"))
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expirado"))
    }
    next(error)
  }
}

// Verificar si el usuario es administrador
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(createError(403, "No tienes permiso para acceder a esta ruta"))
  }
  next()
}

// Verificar si el usuario es dueño del perfil
export const verifyProfileOwner = async (req, res, next) => {
  try {
    const profileId = req.params.id
    const userId = req.user.id

    const belongs = await ProfileRepository.belongsToUser(profileId, userId)

    if (!belongs) {
      return next(createError(403, "No tienes permiso para acceder a este perfil"))
    }

    next()
  } catch (error) {
    next(error)
  }
}
