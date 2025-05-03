import WatchlistRepository from "../repositories/WatchlistRepository.mjs";
import ProfileRepository from "../repositories/ProfileRepository.mjs";
import MovieRepository from "../repositories/MovieRepository.mjs";

export async function getWatchlistForProfile(profileId, userId) {
  try {
    const profile = await ProfileRepository.findProfileById(profileId, userId);
    if (!profile) {
      const error = new Error("Perfil no encontrado");
      error.status = 404;
      throw error;
    }

    let watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);
    if (!watchlist) {
      watchlist = await WatchlistRepository.createEmptyWatchlist(profileId);
    }

    return watchlist;
  } catch (error) {
    throw error; 
  }
}

export async function addToWatchlistService(userId, profileId, movieId) {
  try {
    const profile = await ProfileRepository.findProfileById(profileId, userId);
    if (!profile) {
      const error = new Error("Perfil no encontrado");
      error.status = 404;
      throw error;
    }

    const movie = await MovieRepository.findMovieById(movieId);
    if (!movie) {
      const error = new Error("Película no encontrada");
      error.status = 404;
      throw error;
    }

    if (movie.ageRating > profile.ageRestriction) {
      const error = new Error(
        "Esta película no es apropiada para la restricción de edad de este perfil"
      );
      error.status = 403;
      throw error;
    }

    let watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);

    if (!watchlist) {
      watchlist = await WatchlistRepository.create({
        profile: profileId,
        movies: [movieId],
      });
    } else {
      if (watchlist.movies.includes(movieId)) {
        const error = new Error("La película ya está en la watchlist");
        error.status = 400;
        throw error;
      }

      watchlist.movies.push(movieId);
      await WatchlistRepository.save(watchlist);
    }

    return await WatchlistRepository.findWithMovies(profileId);
  } catch (err) {
    throw err; 
  }
}

export async function removeMovieFromWatchlist(profileId, movieId, userId) {
  try {
    const profile = await ProfileRepository.findProfileById(profileId, userId);
    if (!profile) {
      const error = new Error("Perfil no encontrado");
      error.status = 404;
      throw error;
    }

    const watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);
    if (!watchlist) {
      const error = new Error("Watchlist no encontrada");
      error.status = 404;
      throw error;
    }    
    
    watchlist.movies = watchlist.movies.filter(
      (movie) => movie._id.toString() !== movieId
    );
    
    await WatchlistRepository.save(watchlist);

    return await WatchlistRepository.findWithMovies(profileId);
  } catch (error) {
    throw error;
  }
}