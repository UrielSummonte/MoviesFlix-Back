import Profile from "../models/Profile.mjs";
import IProfileRepository from "./IProfileRepository.mjs";

class ProfileRepository extends IProfileRepository {
  async createProfil(profileData) {
    try {
      return await Profile.create(profileData);
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      throw error;
    }
  }

  async findProfileById(profileId, userid) {
    
    try {
      return await Profile.findOne({ _id: profileId, user: userid})
    } catch (error) {
      console.error("Error al encontrar el perfil:", error);
      throw error;
    }
  }

  async findProfileByUser(userId) {
    try {
      return await Profile.find({ user: userId })
    } catch (error) {
      console.error("Error al encontrar el perfil:", error);
      throw error;
    }
  }

  async updateProfileById(profileId, userId, updateData) {
    return await Profile.findOneAndUpdate(
      { _id: profileId, user: userId },
      updateData,
      { new: true, runValidators: true }
    )
  }

  // async removeProfile(id, userId) {
  //   try {
  //     return await Profile.findByIdAndDelete({ _id: id, user:userId})
  //   } catch (error) {
  //     console.error("Error al remover perfil del usuario:", error);
  //     throw error;
  //   }
  // }

  async deleteProfileById(profile) {
    await profile.deleteOne()
  }

  async belongsToUser(profileId, userId) {
    const profile = await Profile.findById(profileId)
    return profile && profile.user.toString() === userId.toString()
  }
  

  async countProfilesByUser(userId) {
    try {
      // Usamos findByIdAndDelete para obtener el documento actualizado
      return await Profile.countDocuments({ user: userId});
    } catch (error) {
      console.error("Error al eliminar el profile por id:", error);
      throw error;
    }
  }

}

export default new ProfileRepository();
