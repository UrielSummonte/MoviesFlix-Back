import { handleMongooseError, logError } from "../utils/errorUtil.mjs"

export const errorHandler = (err, req, res, next) => {
  // Manejar errores específicos de Mongoose
  const error = handleMongooseError ? handleMongooseError(err) : err;

  // Registrar el error
  console.error(`[${new Date().toISOString()}] Error:`, error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Error interno del servidor";

  // Siempre devolver JSON para simplificar
  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
}

// Middleware para manejar rutas no encontradas
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

// Función para crear errores personalizados con código de estado
export const createError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

// Función para manejar errores de Mongoose
export const handleMongooseError = (err) => {
  let error = { ...err }
  error.message = err.message

  // Error de ID no válido
  if (err.name === "CastError") {
    const message = `Recurso no encontrado con id: ${err.value}`
    error = createError(404, message)
  }

  // Error de campo duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `El campo ${field} ya existe. Por favor use otro valor.`
    error = createError(400, message)
  }

  // Error de validación
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
    error = createError(400, message)
  }

  return error
}

// Función para registrar errores en un archivo de log
export const logError = (err) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`)
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack)
  }
}
