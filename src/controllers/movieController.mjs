import { log } from "console";
import {
  getMovies,
  findMovieById,
} from "../services/movieService.mjs";

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

// export async function getAllPopularMoviesController(req, res) {
//   try {
//     const { profileType } = req.query.profileType || "adult";
//     const movies = await getPopularMovies(profileType);
//     res.status(200).json({
//       success: true,
//       count: movies.length,
//       data: movies,
//     });
//   } catch (error) {
//     console.error("Error al obtener las películas populares:", error);
//     res.status(500).json({
//       message: "Error al obtener las películas populares",
//       error: error.message,
//     });
//   }
// }

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

// export async function searchMoviesByTextController(req, res) {
//   try {
//     const { query } = req.query;
//     const movies = await findMoviesByText(query);
//     res.status(200).json({
//       success: true,
//       count: movies.length,
//       data: movies,
//     });
//   } catch (error) {
//     console.error("Error al buscar películas por texto:", error);
//     res
//       .status(500)
//       .json({ message: "Error al buscar películas", error: error.message });
//   }
// }

// export async function getMoviesByGenreController(req, res) {
//   try {
//     const { genre } = req.params;
//     const profileType = req.query.profileType || "adult";
//     const movies = await getMoviesByGenre(genre, profileType);
//     res.status(200).json({
//       success: true,
//       count: movies.length,
//       data: movies,
//     });
//   } catch (error) {
//     console.error("Error al obtener películas por género:", error);
//     res.status(500).json({
//       message: "Error al obtener películas por género",
//       error: error.message,
//     });
//   }
// }

// export async function getMoviesForProfileController(req, res, next) {
//   try {
//     const profileId = req.params.profileId;
//     const userId = req.user.id;

//     const movies = await getMoviesForProfile(profileId, userId);

//     res.status(200).json(movies);
//   } catch (error) {
//     next(error); // Esto se encargará de errores como 404 o cualquier error inesperado
//   }
// }

// export async function createMovieController(req, res) {
//   try {
//     // Validar que géneros sea un arreglo
//     if (req.body.genres && typeof req.body.genres === 'string') {
//       // Convierte la cadena separada por comas en un arreglo
//       req.body.genres = req.body.genres.split(',').map((genre) => genre.trim());
//     }

//     // Verifica que géneros sea un arreglo no vacío
//     if (!Array.isArray(req.body.genres) || req.body.genres.length === 0) {
//       return res.status(400).json({ message: "Debe proporcionar al menos un género." });
//     }

//     const newMovie = await createMovie(req.body);
//     res.status(201).json(newMovie);
//   } catch (error) {
//     console.error("Error al crear la película:", error);
//     res.status(500).json({ message: "Error al crear la película", error: error.message });
//   }
// }

// export async function updateMovieController(req, res) {
//   try {
//     const { movieId } = req.params;
//     const updatedMovie = await updateMovieById(movieId, req.body);
//     res.status(200).json(updatedMovie);
//   } catch (error) {
//     console.error("Error al actualizar la película:", error);
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({ message: error.message });
//     }
//     res
//       .status(500)
//       .json({
//         message: "Error al actualizar la película",
//         error: error.message,
//       });
//   }
// }

// export async function deleteMovieController(req, res) {
//   try {
//     const { movieId } = req.params;
//     await deleteMovieById(movieId);
//     res.status(204).send(); // 204 No Content para indicar éxito sin cuerpo
//   } catch (error) {
//     console.error("Error al eliminar la película:", error);
//     if (error.statusCode) {
//       return res.status(error.statusCode).json({ message: error.message });
//     }
//     res
//       .status(500)
//       .json({ message: "Error al eliminar la película", error: error.message });
//   }
// }
