import {
  getMovies,
  findMovieById,
} from "../services/movieService.mjs";
import { getUserStats } from "../services/adminService.mjs";

// Traer todas las movies con paginado y filtros
export async function getAllMoviesController(req, res) {
  try {
    const page =
      Number.isNaN(Number.parseInt(req.query.page)) ||
      Number.parseInt(req.query.page) < 1
        ? 1
        : Number.parseInt(req.query.page);
    const limit =
      Number.isNaN(Number.parseInt(req.query.limit)) ||
      Number.parseInt(req.query.limit) < 1
        ? 10
        : Number.parseInt(req.query.limit);

    const filters = {};
    if (req.query.genre) filters.genre = req.query.genre;
    if (req.query.profileType) filters.profileType = req.query.profileType;
    if (req.query.search) filters.search = req.query.search;

    const { movies, total, totalPages, currentPage } = await getMovies(
      page,
      limit,
      filters
    );
    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages,
      currentPage,
      data: movies,
    });
  } catch (error) {
    console.error("Error al obtener las películas:", error);
    res.status(500).json({
      message: "Error al obtener las películas",
      error: error.message,
    });
  }
}

// Traer movie por id
export async function getMovieByIdController(req, res) {
  try {
    const movieId = req.params.id;
    const movie = await findMovieById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }
    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Error al obtener la película por ID:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la película", error: error.message });
  }
}

// Controlador de estadísticas
export async function getUserStatsController(req, res, next) {
  try {
    const stats = await getUserStats();

    res.json({
      success: true,
      data: stats,
      user: req.user, // Si quieres incluir al usuario autenticado
    });
  } catch (error) {
    next(error);
  }
}

