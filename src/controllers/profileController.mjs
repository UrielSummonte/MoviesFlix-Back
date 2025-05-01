import { getUserProfiles, getProfile ,updateProfile, deleteProfile } from "../services/profileService.mjs"
import Watchlist from "../models/Watchlist.mjs"
import Profile from "../models/Profile.mjs"
import { validateProfile } from "../validators/profileValidator.js"

// Obtener todos los perfiles de un usuario
export async function getProfilesController(req, res, next) {
  try {
    const userId = req.user.id
    const profiles = await getUserProfiles(userId)

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo perfil
export async function createProfileController(req, res, next) {
  try {
    // Validar cuerpo de la solicitud
    const { error } = validateProfile(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    // Verificar si el usuario ha alcanzado el máximo de perfiles (ej., 5)
    const profileCount = await Profile.countDocuments({ user: req.user.id })
    if (profileCount >= 3) {
      return res.status(400).json({ message: "Has alcanzado el número máximo de perfiles" })
    }

    const { name, type, avatar } = req.body

    // Crear perfil
    const profile = new Profile({
      name,
      type,
      avatar: avatar || undefined,
      user: req.user.id,
    })

    await profile.save()

    // Crear watchlist vacía para el perfil
    const watchlist = new Watchlist({
      profile: profile._id,
      films: [],
    })

    await watchlist.save()

    res.status(201).json(profile)
  } catch (error) {
    next(error)
  }
}

// Obtener un perfil específico
export async function getProfileByIdController(req, res, next) {
  try {
    const profileId = req.params.id
    const userId = req.user.id

    const profile = await getProfile(profileId, userId)

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar un perfil
export const updateProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const profileId = req.params.id
    const profileData = req.body
    const updatedProfile = await updateProfile(userId, profileId, profileData)
    res.status(200).json(updatedProfile)
  } catch (error) {
    next(error)
  }
}

export const deleteProfileController = async (req, res, next) => {
  try {
    const profileId = req.params.id
    const userId = req.user.id
    const result = await deleteProfile(profileId, userId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}


// // Agregar película a la watchlist
// export async function addToWatchlistController(req, res, next) {
//   try {
//     const profileId = req.params.id
//     const { movieId } = req.body
//     const userId = req.user.id

//     await ProfileService.addToWatchlist(profileId, movieId, userId)

//     res.status(200).json({
//       success: true,
//       message: "Película agregada a la watchlist",
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// // Eliminar película de la watchlist
// export async function removeFromWatchlistController(req, res, next) {
//   try {
//     const profileId = req.params.id
//     const { movieId } = req.body
//     const userId = req.user.id

//     await ProfileService.removeFromWatchlist(profileId, movieId, userId)

//     res.status(200).json({
//       success: true,
//       message: "Película eliminada de la watchlist",
//     })
//   } catch (error) {
//     next(error)
//   }
// }


// Obtener watchlist de un perfil
// export async function getWatchlistController(req, res, next) {
//   try {
//     const profileId = req.params.id; // ID del perfil desde los parámetros de la URL
//     const userId = req.user.id; // ID del usuario desde la sesión autenticada

//     // Llamar al servicio para obtener la watchlist
//     const watchlist = await getWatchlist(profileId, userId);

//     // Responder con los datos
//     res.status(200).json({
//       success: true,
//       count: watchlist.length, // Número de películas en la watchlist
//       data: watchlist, // Películas de la watchlist
//     });
//   } catch (error) {
//     next(error); // Pasar el error al middleware de manejo de errores
//   }
// }


