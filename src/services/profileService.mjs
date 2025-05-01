import ProfileRepository from "../repositories/ProfileRepository.mjs";
//import UserRepository from "../repositories/UserRepository.mjs";
import WatchlistRepository from "../repositories/WatchlistRepository.mjs";
import { createError } from "../utils/errorUtil.mjs";
import  {validateProfile}  from '../validators/profileValidator.js'

export async function getUserProfiles(userId) {
  try {
    return await ProfileRepository.findProfileByUser(userId);
  } catch (error) {
    console.error("Error al obtener los perfiles de usuario:", error);
    throw error;
  }
}

export async function createProfile(userId, profileData) {
  try {
    const existingProfiles = await ProfileRepository.findProfileByUser(userId);

    if (existingProfiles.length >= 3) {
      throw createError(400, "No puedes crear más de 3 perfiles");
    }

    // Crear perfil
    const newProfile = await ProfileRepository.createProfile({
      ...profileData,
      user: userId,
    });
    // Create empty watchlist for the profile
    await WatchlistRepository.insertarWatchlistRepository(profile._id);

    return newProfile;
  } catch (error) {
    console.error("Error al crear el perfil de usuario:", error);
    throw error;
  }
}

export async function getProfile(profileId, userId) {
  try {
    const profile = await ProfileRepository.findProfileById(profileId, userId);

    if (!profile) {
      throw createError(404, "Perfil no encontrado");
    }

    return profile;
  } catch (error) {
    console.error("Error al obtener el perfil de usuario:", error);
    throw error;
  }
}

export async function updateProfile(userId, profileId, profileData) {
  const { error } = validateProfile(profileData)
  if (error) {
    const validationError = new Error(error.details[0].message)
    validationError.status = 400
    throw validationError
  }

  const { name, type, avatar } = profileData

  const updatedProfile = await ProfileRepository.updateProfileById(profileId, userId, {
    name,
    type,
    avatar: avatar || undefined
  })

  if (!updatedProfile) {
    const notFoundError = new Error("Perfil no encontrado")
    notFoundError.status = 404
    throw notFoundError
  }

  return updatedProfile
}

// export async function deleteProfile(profileId, userId) {
//   try {
//     // Verificar que el perfil exista
//     const profile = await ProfileRepository.findProfileById(profileId);

//     if (!profile) {
//       throw createError(404, "Perfil no encontrado");
//     }

//     // Verificar que el perfil pertenezca al usuario
//     if (profile.user.toString() !== userId) {
//       throw createError(403, "No tienes permiso para eliminar este perfil");
//     }

//     // No permitir eliminar el perfil de niños por defecto
//     if (profile.isDefault) {
//       throw createError(400, "No puedes eliminar el perfil por defecto");
//     }

//     // Delete associated watchlist
//     await WatchlistRepository.removeWatchlistByProfile(profile._id);

//     // Delete profile
//     await ProfileRepository.removeProfile(id, userId);

//     return { message: "Perfil eliminado exitosamente" };
//   } catch (error) {
//     console.error("Error al eliminar el perfil de usuario:", error);
//     throw error;
//   }
// }

export const deleteProfile = async (profileId, userId) => {
  const profile = await ProfileRepository.findProfileById(profileId, userId)

  if (!profile) {
    const error = new Error("Perfil no encontrado")
    error.status = 404
    throw error
  }

  await WatchlistRepository.removeWatchlistByProfile(profile._id)
  await ProfileRepository.deleteProfileById(profile)

  return { message: "Perfil eliminado exitosamente" }
}

// export async function getWatchlist(profileId, userId) {
//   try {
//     // Verificar que el perfil exista y pertenezca al usuario
//     const profile = await ProfileService.getProfile(profileId, userId);
//     if (!profile) {
//       throw new Error('Perfil no encontrado o no pertenece al usuario');
//     }

//     // Obtener la watchlist del perfil
//     const watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);

//     // Si no hay elementos en la watchlist, retorna un array vacío
//     if (!watchlist || watchlist.length === 0) {
//       return [];
//     }

//     // Retornar solo las películas de la watchlist
//     return watchlist.map((item) => item.movie);
//   } catch (error) {
//     console.error(`Error al obtener la watchlist para el perfil ${profileId}:`, error);
//     throw error; // Lanzar el error para que lo maneje el controlador
//   }
// }


// export async function addToWatchlist(profileId, movieId, userId) {
//   try {
//     // Verificar que el perfil exista y pertenezca al usuario
//     const profile = await ProfileService.getProfile(profileId, userId);

//     // Verificar si la película ya está en la watchlist
//     const exists = await WatchlistRepository.existsWatchlist(
//       profileId,
//       movieId
//     );
//     if (exists) {
//       throw createError(400, "La película ya está en la watchlist");
//     }

//     // Agregar película a la watchlist
//     await WatchlistRepository.add(profileId, movieId);

//     return true;
//   } catch (error) {
//     console.error("Error al agreagar a la watchlist:", error);
//     throw error;
//   }
// }

// export async function removeFromWatchlist(profileId, movieId, userId) {
//   try {
//     // Verificar que el perfil exista y pertenezca al usuario
//     const profile = await ProfileService.getProfile(profileId, userId);

//     // Eliminar película de la watchlist
//     await WatchlistRepository.remove(profileId, movieId);

//     return true;
//   } catch (error) {
//     console.error("Error al agreagar a la watchlist:", error);
//     throw error;
//   }
// }
