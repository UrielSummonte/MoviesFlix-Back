import { getUserProfiles, getProfile ,updateProfile, deleteProfile, createProfile } from "../services/profileService.mjs"


// Controlador para obtener todos los profiles
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

// Controlador para crear un perfil
export async function createProfileController(req, res, next) {
  try {
    const profile = await createProfile(req.user.id, req.body);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
}

// Controlador para obtener un profile por id
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

// Controlado para actulizar un profile
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


// Controlador para delete profile
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

