import User from "../models/User.mjs";
import IUserRepository from "./IUserRepository.mjs";

class UserRepository extends IUserRepository {
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      return await User.findById(userId).select("-password");
    } catch (error) {
      console.error("Error al encontrar el usuario:", error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email })
    } catch (error) {
      console.error("Error al encontrar el usuario:", error);
      throw error;
    }
  }

  async removeUserById(id) {
    try {
      // Usamos findByIdAndDelete para obtener el documento actualizado
      return await User.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error("Error al eliminar el useuario por id:", error);
      throw error;
    }
  }

  async updateUserById(id, userData) {
    try {
      return await User.findByIdAndUpdate(
        { _id: id },
        {$set: userData},
        { new:true }
      ).select("-password")
    } catch (error) {
      console.error("Error al actualziar el usuario:", error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await User.find({}).select("-password")
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  }

  async countUsers() {
    try {
      return await User.countDocuments()
    } catch (error) {
      console.error("Error al contar todos los usuarios:", error);
      throw error;
    }
  }

  async countUsersByRol(role) {
    try {
      return await User.countDocuments({ role })
    } catch (error) {
      console.error("Error al contar todos los usuarios por rol:", error);
      throw error;
    }
  }
}

export default new UserRepository();
