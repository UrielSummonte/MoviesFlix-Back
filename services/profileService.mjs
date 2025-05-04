import ProfileRepository from "../repositories/ProfileRepository.mjs";
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
    const { error } = validateProfile(profileData);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    const profileCount = await ProfileRepository.countProfilesByUser(userId);
    if (profileCount >= 4) {
      const err = new Error("Has alcanzado el número máximo de perfiles");
      err.status = 400;
      throw err;
    }

    const { name, type, avatar } = profileData;
    const newProfile = await ProfileRepository.createProfile({
      name,
      type,
      avatar: avatar || undefined,
      user: userId,
    });

    await WatchlistRepository.create({ profile: newProfile._id });

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
