// import jwt from "jsonwebtoken"
// import { UserRepository } from "../repositories/UserRepository.mjs"
// import { ProfileRepository } from "../repositories/ProfileRepository.mjs"
// import { createError } from "../utils/errorUtil.mjs"

// export const AuthService = {
//   // Registro de usuario
//   register: async (userData) => {
//     // Verificar si el usuario ya existe
//     const existingUser = await UserRepository.findByEmail(userData.email)
//     if (existingUser) {
//       throw createError(400, "El email ya está registrado")
//     }

//     // Validar formato de email
//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
//     if (!emailRegex.test(userData.email)) {
//       throw createError(400, "Formato de email inválido")
//     }

//     // Validar contraseña
//     if (userData.password.length < 6) {
//       throw createError(400, "La contraseña debe tener al menos 6 caracteres")
//     }

//     // Validar nombre
//     if (!userData.name || userData.name.trim().length < 2) {
//       throw createError(400, "El nombre debe tener al menos 2 caracteres")
//     }

//     // Crear nuevo usuario
//     const newUser = await UserRepository.create(userData)

//     // Crear perfil por defecto para niños
//     const childProfile = await ProfileRepository.create({
//       name: "Niños",
//       type: "child",
//       user: newUser._id,
//       isDefault: true,
//     })

//     // Actualizar usuario con el perfil creado
//     await UserRepository.addProfile(newUser._id, childProfile._id)

//     // Generar token
//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

//     // Obtener usuario actualizado sin contraseña
//     const user = await UserRepository.findById(newUser._id)

//     return { user, token }
//   },

//   // Inicio de sesión
//   login: async (email, password) => {
//     // Buscar usuario por email
//     const user = await UserRepository.findByEmail(email)
//     if (!user) {
//       throw createError(404, "Usuario no encontrado")
//     }

//     // Verificar contraseña
//     const isPasswordCorrect = await user.comparePassword(password)
//     if (!isPasswordCorrect) {
//       throw createError(401, "Contraseña incorrecta")
//     }

//     // Actualizar fecha de último login
//     await user.updateLastLogin()

//     // Generar token
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

//     // Obtener usuario sin contraseña
//     const userWithoutPassword = await UserRepository.findById(user._id)

//     return { user: userWithoutPassword, token }
//   },

//   // Verificar token
//   verifyToken: async (token) => {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET)
//       const user = await UserRepository.findById(decoded.id)

//       if (!user) {
//         throw createError(404, "Usuario no encontrado")
//       }

//       return user
//     } catch (error) {
//       if (error.name === "JsonWebTokenError") {
//         throw createError(401, "Token inválido")
//       }
//       if (error.name === "TokenExpiredError") {
//         throw createError(401, "Token expirado")
//       }
//       throw error
//     }
//   },
// }
