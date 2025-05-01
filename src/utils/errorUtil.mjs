// Funcion para crear errores personalizados con código de estado
export const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Funcion para crear errores de Mongoose
export const handleMongooseError = (err) => {
  let error = { ...err };
  error.message = err.message;

  // Error de Id no válido
  if (err.name === "CastError") {
    const message = `Recurso no encontrado con id: ${err.value}`;
    error = createError(404, message);
  }

  // Error de campo duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `El campo ${field} ya existe. Por favot use otro valor`;
    error = createError(400, message);
  }

  // Error de validación
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = createError(400, message);
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
