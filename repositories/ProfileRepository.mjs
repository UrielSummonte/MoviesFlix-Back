import Profile from "../models/Profile.mjs";
import IProfileRepository from "./IProfileRepository.mjs";

class ProfileRepository extends IProfileRepository {

  // Repositorio para crear un profile
  async createProfile(profileData) {
    try {
      const profile = new Profile(profileData);
      return await profile.save();
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      throw error;
    }
  }

  // Repositorio para find un profile por profile e id
  async findProfileById(profileId, userid) {
    
    try {
      return await Profile.findOne({ _id: profileId, user: userid})
    } catch (error) {
      console.error("Error al encontrar el perfil:", error);
      throw error;
    }
  }

  // Repositorio para fin un profile por id
  async findProfileByUser(userId) {
    try {
      return await Profile.find({ user: userId })
    } catch (error) {
      console.error("Error al encontrar el perfil:", error);
      throw error;
    }
  }

  // Repositorio para actualizar un profile
  async updateProfileById(profileId, userId, updateData) {
    return await Profile.findOneAndUpdate(
      { _id: profileId, user: userId },
      updateData,
      { new: true, runValidators: true }
    )
  }

  // Repositorio para eliminar un profile
  async deleteProfileById(profile) {
    try {
      await profile.deleteOne()
      console.log("Perfil eliminado correctamente")
    } catch (error) {
      console.error("Error al eliminar el perfil:", error)
      throw error 
    }
  }
  
  // Repositorio para saber si un profile pertenece a un user
  async belongsToUser(profileId, userId) {
    const profile = await Profile.findById(profileId)
    return profile && profile.user.toString() === userId.toString()
  }
  

  // Repositorio para contar los profiles por usuario
  async countProfilesByUser(userId) {
    try {
      return await Profile.countDocuments({ user: userId});
    } catch (error) {
      console.error("Error al eliminar el profile por id:", error);
      throw error;
    }
  }

}

export default new ProfileRepository();
