import User from "../models/User.mjs";
import { handleMongooseError } from "../utils/errorUtil.mjs";
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

// Renderizar form login
export const renderLoginForm = (req, res) => {
  res.render("admin/login", { error: req.query.error || null });
};

// Renderizar form register
export async function renderRegisterFormController(req, res) {
  res.render("admin/register", { error: req.query.error || null });
}

// Controller del login administrador
export async function adminLoginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.redirect("/admin/login?error=Usuario no encontrado");
    }

    if (user.role !== "admin") {
      return res.redirect(
        "/admin/login?error=No tienes permisos de administrador"
      );
    }

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

    res.redirect("/admin");
  } catch (error) {
    console.error("Error en login de administrador:", error);
    res.redirect("/admin/login?error=Error al iniciar sesión");
  }
}

// Controlador de logout de administrador
export async function adminLogoutController(req, res) {
  res.clearCookie("admin_token");
  res.redirect("/admin/login");
}

// Renderizar panel administrador
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

// Renderizar add movie
export const renderAddMovieControlle = (req, res) => {
  res.render("admin/addMovie", { user: req.user });
};

// Renderizar edit movie
export async function renderEditMovieController(req, res, next) {
  try {
    const movie = await findMovieById(req.params.id);

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

// Controlador de add movie
export async function addMovieController(req, res, next) {
  try {
    const movieData = req.body;

    if (movieData.genres && typeof movieData.genres === "string") {
      movieData.genres = movieData.genres
        .split(",")
        .map((genre) => genre.trim());
    }

    if (movieData.cast && typeof movieData.cast === "string") {
      movieData.cast = movieData.cast.split(",").map((actor) => actor.trim());
    }

    if (movieData.title) {
      try {
        const tmdbSearchResult = await searchMovieByTitle(movieData.title);

        if (
          tmdbSearchResult &&
          tmdbSearchResult.results &&
          tmdbSearchResult.results.length > 0
        ) {
          const tmdbMovie = tmdbSearchResult.results[0]; 

          const trailersData = await getMovieTrailers(tmdbMovie.id);

          movieData.tmdbId = tmdbMovie.id;
          movieData.original_language = tmdbMovie.original_language
          movieData.release_date = tmdbMovie.release_date
          movieData.vote_average = tmdbMovie.vote_average

          const youtubeTrailer = trailersData.results?.find(
            (trailer) => trailer.site === "YouTube"
          );

          if (youtubeTrailer) {
            movieData.trailerURL = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
          } else {
            movieData.trailerURL = null; 
          }
        } else {
          console.log("Película no encontrada en TMDb.");
          movieData.tmdbId = null;
          movieData.trailer = null;
        }
      } catch (error) {
        console.error("Error al buscar la película en TMDb:", error);
        movieData.tmdbId = null;
        movieData.trailer = null;
      }
    }

    await createMovie(movieData);
    res.redirect("/admin");
  } catch (error) {
    const handledError = handleMongooseError(err)
    if (handledError.statusCode === 400) {
      res.render('admin/addMovie', { errorMessage: handledError.message, user: req.user });
    } else {
      next(handledError); 
    }
  }
}

// Controlador de update movie
export async function updateMovieController(req, res, next) {
  try {
    const movieId = req.params.id;
    const movieData = req.body;

    if (typeof movieData.genres === "string") {
      movieData.genres = movieData.genres
        .split(",")
        .map((genre) => genre.trim());
    }

    if (typeof movieData.cast === "string") {
      movieData.cast = movieData.cast.split(",").map((actor) => actor.trim());
    }

    if (movieData.title) {
      try {
        const tmdbSearchResult = await searchMovieByTitle(movieData.title);

        if (
          tmdbSearchResult &&
          tmdbSearchResult.results &&
          tmdbSearchResult.results.length > 0
        ) {
          const tmdbMovie = tmdbSearchResult.results[0]; 
          
          const trailersData = await getMovieTrailers(tmdbMovie.id);

          movieData.tmdbId = tmdbMovie.id;
          movieData.original_language = tmdbMovie.original_language
          movieData.release_date = tmdbMovie.release_date
          movieData.vote_average = tmdbMovie.vote_average

          const youtubeTrailer = trailersData.results?.find(
            (trailer) => trailer.site === "YouTube"
          );

          if (youtubeTrailer) {
            movieData.trailerURL = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
          } else {
            movieData.trailerURL = null; 
          }
        } else {
          console.log("Película no encontrada en TMDb.");
          movieData.tmdbId = null;
          movieData.trailer = null;
        }
      } catch (error) {
        console.error("Error al buscar la película en TMDb:", error);
        movieData.tmdbId = null;
        movieData.trailer = null;
      }
    }

    await updateMovieById(movieId, movieData);
    res.redirect("/admin");
  } catch (error) {
    next(handleMongooseError(err));
  }
}

// Controlador de delete movie
export async function deleteMovieController(req, res, next) {
  try {
    const movieId = req.params.id;
    await deleteMovieById(movieId);
    res.redirect("/admin");
  } catch (error) {
    next(handleMongooseError(error));
  }
}

// Controlador de estadisticas
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
    const { error } = validateRegistration(req.body);
    if (error) {
      return res.status(400).render("admin/register", {
        error: error.details[0].message,
        formData: req.body, 
      });
    }

    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("admin/register", {
        error: "Ya existe un usuario con este email",
        formData: req.body,
      });
    }

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

    res.redirect("/admin/login"); 
  } catch (error) {
    next(error);
  }
};
