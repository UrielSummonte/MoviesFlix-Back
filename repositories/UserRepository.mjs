import User from "../models/User.mjs";
import IUserRepository from "./IUserRepository.mjs";

class UserRepository extends IUserRepository {

  // Repositorio para crear un usuario
  async createUser(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw error;
    }
  }

  // Repositorio para encontrar un usuario por id
  async findUserById(userId) {
    try {
      return await User.findById(userId).select("-password");
    } catch (error) {
      console.error("Error al encontrar el usuario:", error);
      throw error;
    }
  }

  // Repositorio para encontrar un usuario por mail
  async findUserByEmail(email) {
    try {
      return await User.findOne({ email })
    } catch (error) {
      console.error("Error al encontrar el usuario:", error);
      throw error;
    }
  }

  // Repositorio para eliminar un usuario por id
  async removeUserById(id) {
    try {
      return await User.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error("Error al eliminar el useuario por id:", error);
      throw error;
    }
  }

  // Repositorio para actualizar un usuario por id
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

  // Repositorio para obtener todos los usuarios
  async getAllUsers() {
    try {
      return await User.find({}).select("-password")
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  }

  // Repositorio para contar todos los usuarios
  async countUsers() {
    try {
      return await User.countDocuments()
    } catch (error) {
      console.error("Error al contar todos los usuarios:", error);
      throw error;
    }
  }

  // Repositorio para contar todos los uuarios por rol
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
