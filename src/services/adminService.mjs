import UserRepository from "../repositories/UserRepository.mjs";
import MovieRepository from "../repositories/MovieRepository.mjs";

// Obtener estadísticas de usuarios
export async function getUserStats() {
  const totalUsers = await UserRepository.countUsers();
  const adminUsers = await UserRepository.countUsersByRol("admin");
  const regularUsers = totalUsers - adminUsers;

  return {
    totalUsers,
    adminUsers,
    regularUsers,
  };
}

// Obtener películas para el panel de administración
export async function getMoviesForAdmin(page = 1, limit = 10) {
  return await MovieRepository.getMovies({}, page, limit);
}

