import jwt from "jsonwebtoken"
import User from "../models/User.mjs"
import { validateRegistration, validateLogin } from "../validators/authValidator.js"

// Registrar un nuevo usuario
export const register = async (req, res, next) => {
  try {
    // Validar cuerpo de la solicitud
    const { error } = validateRegistration(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const { email, password, name } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un usuario con este email" })
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      name,
    })

    await user.save()

    // Generar token JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login de usuario
export const login = async (req, res, next) => {
  try {
    // Validar cuerpo de la solicitud
    const { error } = validateLogin(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const { email, password } = req.body

    // Buscar usuario por email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Email o contraseña inválidos" })
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email o contraseña inválidos" })
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Obtener usuario actual
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
