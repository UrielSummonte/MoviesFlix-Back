import UserRepository from "../repositories/UserRepository.mjs";

export async function getUsers() {
    try {
        return await UserRepository.getAllUsers();
    } catch (error) {
        console.error("Error en obtener todos los usuarios:", error);
        throw error;
    }
}

export async function obtenerUserById(id) {
    try {
        return await UserRepository.findUserById(id);
    } catch (error) {
        console.error("Error en obtener el usuario por id:", error);
        throw error;
    }
}

export async function obtenerUserByEmail(email) {
    try {
        return await UserRepository.findUserByEmail(email);
    } catch (error) {
        console.error("Error en obtener el usuario por email:", error);
        throw error;
    }
}

export async function createUser(userData) {
    try {
        return await UserRepository.createUser(userData);
    } catch (error) {
        console.error("Error en insertarUserService:", error);
        throw error;
    }
}


export async function updateUserById(id, userData) {
    try {
        return await UserRepository.updateUserById(id, userData);
    } catch (error) {
        console.error("Error en editarUserByIdService:", error);
        throw error;
    }
}

export async function removeUserById(id) {
    try {
        return await UserRepository.removeUserById(id);
    } catch (error) {
        console.error("Error en eliminarUserByIdService:", error);
        throw error;
    }
}

