import Movie from "../models/Movie.mjs";
import User from "../models/User.mjs";
import { createError } from "../utils/errorUtil.mjs";
import {
  searchMovieByTitle,
  getMovieTrailers,
} from "../services/tmdbService.mjs";
import {
  createMovie,
  updateMovieById,
  deleteMovieById,
  findMovieById,
} from "../services/movieService.mjs";
import { getUserStats, getMoviesForAdmin } from "../services/adminService.mjs";
import jwt from "jsonwebtoken";
import { validateRegistration } from "../validators/authValidator.js";

// Renderizar formulario de login
export const renderLoginForm = (req, res) => {
  res.render("admin/login", { error: req.query.error || null });
};

// Renderizar formulario de registro de administrador
export async function renderRegisterFormController(req, res) {
  res.render("admin/register", { error: req.query.error || null });
}

// Procesar login de administrador
export async function adminLoginController(req, res, next) {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.redirect("/admin/login?error=Usuario no encontrado");
    }

    // Verificar si el usuario es administrador
    if (user.role !== "admin") {
      return res.redirect(
        "/admin/login?error=No tienes permisos de administrador"
      );
    }

    // Verificar contraseña
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.redirect("/admin/login?error=Contraseña incorrecta");
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Establecer cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    // Redireccionar al panel de administración
    res.redirect("/admin");
  } catch (error) {
    console.error("Error en login de administrador:", error);
    res.redirect("/admin/login?error=Error al iniciar sesión");
  }
}

// Cerrar sesión de administrador
export async function adminLogoutController(req, res) {
  res.clearCookie("admin_token");
  res.redirect("/admin/login");
}

// Renderizar panel de administración
export async function renderAdminPanelController(req, res, next) {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = 10;

    const { movies, total, totalPages, currentPage } = await getMoviesForAdmin(
      page,
      limit
    );

    res.render("admin/dashboard", {
      movies,
      currentPage,
      totalPages,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// Renderizar formulario para agregar película
export const renderAddMovieControlle = (req, res) => {
  res.render("admin/addMovie", { user: req.user });
};

// Renderizar formulario para editar película
export async function renderEditMovieController(req, res, next) {
  try {
    const movie = await findMovieById(req.params.id);

    // Aseguramos que genres esté como array
    const selectedGenres = Array.isArray(movie.genres)
      ? movie.genres
      : [movie.genres];

    res.render("admin/editMovie", {
      movie,
      user: req.user,
      selectedGenres,
    });
  } catch (error) {
    next(error);
  }
}

// Agregar película
export async function addMovieController(req, res, next) {
  try {
    const movieData = req.body;

    // Convertir géneros de string a array
    if (movieData.genres && typeof movieData.genres === "string") {
      movieData.genres = movieData.genres
        .split(",")
        .map((genre) => genre.trim());
    }

    // Convertir cast de string a array
    if (movieData.cast && typeof movieData.cast === "string") {
      movieData.cast = movieData.cast.split(",").map((actor) => actor.trim());
    }

    // Buscar la película por su título para obtener tmdbId y trailer
    if (movieData.title) {
      try {
        // Asumiendo que tienes una función para buscar película en TMDb por título
        const tmdbSearchResult = await searchMovieByTitle(movieData.title);

        if (
          tmdbSearchResult &&
          tmdbSearchResult.results &&
          tmdbSearchResult.results.length > 0
        ) {
          const tmdbMovie = tmdbSearchResult.results[0]; // Tomamos el primer resultado

          const trailersData = await getMovieTrailers(tmdbMovie.id);

          // Asignamos el tmdbId, el lenguaje, date y el vote
          movieData.tmdbId = tmdbMovie.id;
          movieData.original_language = tmdbMovie.original_language
          movieData.release_date = tmdbMovie.release_date
          movieData.vote_average = tmdbMovie.vote_average

          // Buscar el primer trailer de YouTube (si existe)
          const youtubeTrailer = trailersData.results?.find(
            (trailer) => trailer.site === "YouTube"
          );

          // Si encontramos un trailer de YouTube, lo asignamos
          if (youtubeTrailer) {
            movieData.trailerURL = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
          } else {
            movieData.trailerURL = null; // Si no hay trailer, asignamos null
          }
        } else {
          // Si no se encuentra una película, asignar valores predeterminados o manejar el error
          console.log("Película no encontrada en TMDb.");
          movieData.tmdbId = null;
          movieData.trailer = null;
        }
      } catch (error) {
        console.error("Error al buscar la película en TMDb:", error);
        // Manejar error de búsqueda, quizás asignar valores predeterminados o manejar de otra forma
        movieData.tmdbId = null;
        movieData.trailer = null;
      }
    }

    await createMovie(movieData);
    res.redirect("/admin");
  } catch (error) {
    if (error.code === 11000) {
      // Si es error de duplicado, mostrar mensaje
      res.render('admin/addMovie', { errorMessage: 'La película ya existe.', user: req.user });
    } else {
      next(error); // Otros errores los seguimos mandando al manejador general
    }
  }
}

// Agregar película desde TMDB
// export const addMovieFromTMDB = async (req, res, next) => {
//   try {
//     const { tmdbId } = req.body;

//     // Verificar si la película ya existe
//     const existingMovie = await Movie.findOne({ tmdbId });
//     if (existingMovie) {
//       return next(
//         createError(400, "La película ya existe en la base de datos")
//       );
//     }

//     // Obtener detalles de la película desde TMDB
//     const movieData = await fetchMovieFromTMDB(tmdbId);

//     if (!movieData) {
//       return next(createError(404, "Película no encontrada en TMDB"));
//     }

//     const newMovie = new Movie(movieData);
//     await newMovie.save();

//     res.redirect("/admin");
//   } catch (error) {
//     next(error);
//   }
// };

// Actualizar película
export async function updateMovieController(req, res, next) {
  try {
    const movieId = req.params.id;
    const movieData = req.body;

    // Convertir géneros de string a array
    if (typeof movieData.genres === "string") {
      movieData.genres = movieData.genres
        .split(",")
        .map((genre) => genre.trim());
    }

    // Convertir cast de string a array
    if (typeof movieData.cast === "string") {
      movieData.cast = movieData.cast.split(",").map((actor) => actor.trim());
    }

    if (movieData.title) {
      try {
        // Asumiendo que tienes una función para buscar película en TMDb por título
        const tmdbSearchResult = await searchMovieByTitle(movieData.title);

        if (
          tmdbSearchResult &&
          tmdbSearchResult.results &&
          tmdbSearchResult.results.length > 0
        ) {
          const tmdbMovie = tmdbSearchResult.results[0]; // Tomamos el primer resultado
          
          const trailersData = await getMovieTrailers(tmdbMovie.id);

          // Asignamos el tmdbId, el lenguaje, date y el vote
          movieData.tmdbId = tmdbMovie.id;
          movieData.original_language = tmdbMovie.original_language
          movieData.release_date = tmdbMovie.release_date
          movieData.vote_average = tmdbMovie.vote_average

          // Buscar el primer trailer de YouTube (si existe)
          const youtubeTrailer = trailersData.results?.find(
            (trailer) => trailer.site === "YouTube"
          );

          // Si encontramos un trailer de YouTube, lo asignamos
          if (youtubeTrailer) {
            movieData.trailerURL = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
          } else {
            movieData.trailerURL = null; // Si no hay trailer, asignamos null
          }
        } else {
          // Si no se encuentra una película, asignar valores predeterminados o manejar el error
          console.log("Película no encontrada en TMDb.");
          movieData.tmdbId = null;
          movieData.trailer = null;
        }
      } catch (error) {
        console.error("Error al buscar la película en TMDb:", error);
        // Manejar error de búsqueda, quizás asignar valores predeterminados o manejar de otra forma
        movieData.tmdbId = null;
        movieData.trailer = null;
      }
    }

    await updateMovieById(movieId, movieData);
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
}

// Eliminar película
export async function deleteMovieController(req, res, next) {
  try {
    const movieId = req.params.id;
    await deleteMovieById(movieId);
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
}

// Estadísticas de usuarios
export async function getUserStatsController(req, res, next) {
  try {
    const stats = await getUserStats();

    res.render("admin/userStats", {
      ...stats,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// Registrar un nuevo administrador
export const register = async (req, res, next) => {
  try {
    // Validar cuerpo de la solicitud
    const { error } = validateRegistration(req.body);
    if (error) {
      // 🚨 En vez de JSON, renderizamos la vista 'register' con el error
      return res.status(400).render("admin/register", {
        error: error.details[0].message,
        formData: req.body, // para mantener los campos cargados
      });
    }

    const { email, password, name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("admin/register", {
        error: "Ya existe un usuario con este email",
        formData: req.body,
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      name,
      role: "admin",
    });

    await user.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect("/admin/login"); // ✅ Mejor redirigir a login después de registrarse
  } catch (error) {
    next(error);
  }
};
