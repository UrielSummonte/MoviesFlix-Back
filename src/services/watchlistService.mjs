import WatchlistRepository from '../repositories/WatchlistRepository.mjs';
import ProfileRepository from '../repositories/ProfileRepository.mjs';
import MovieRepository from '../repositories/MovieRepository.mjs';

export const getWatchlist = async (profileId, userId) => {
  // Verify profile belongs to user
  const profile = await ProfileRepository.findProfileById(profileId, userId);
  if (!profile) {
    throw new Error('Perfil no encontrado');
  }
  
  // Get watchlist with populated films
  let watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);
  
  // If no watchlist exists, create one
  if (!watchlist) {
    watchlist = await WatchlistRepository.addWatchlist(profileId);
    watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);
  }
  
  // Filter films based on profile age restriction and certification
  const filteredFilms = watchlist.films.filter(film => {
    // Map certification to age
    let movieAgeRating = 0;
    switch(movie.rating) {
      case "G": movieAgeRating = 0; break;
      case "PG": movieAgeRating = 7; break;
      case "PG-13": movieAgeRating = 13; break;
      case "R": movieAgeRating = 17; break;
      case "NC-17": movieAgeRating = 18; break;
      default: movieAgeRating = 0;
    }
    
    return movieAgeRating <= profile.ageRestriction;
  });
  
  return {
    ...watchlist.toObject(),
    movies: filteredMovies
  };
};

export const addToWatchlist = async (profileId, movieId, userId) => {
  // Verify profile belongs to user
  const profile = await ProfileRepository.findProfileById(profileId, userId);
  if (!profile) {
    throw new Error('Perfil no encontrado');
  }
  
  // Verify film exists
  const movie = await MovieRepository.findMovieById(movieId);
  if (!movie) {
    throw new Error('Película no encontrada');
  }
  
  // Map certification to age
  let movieAgeRating = 0;
  switch(movie.rating) {
    case "G": movieAgeRating = 0; break;
    case "PG": movieAgeRating = 7; break;
    case "PG-13": movieAgeRating = 13; break;
    case "R": movieAgeRating = 17; break;
    case "NC-17": movieAgeRating = 18; break;
    default: movieAgeRating = 0;
  }
  
  // Check if film is appropriate for profile age
  if (movieAgeRating > profile.ageRestriction) {
    throw new Error('Esta película no es apropiada para la restricción de edad de este perfil');
  }
  
  // Get or create watchlist
  let watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);
  
  if (!watchlist) {
    watchlist = await WatchlistRepository.addWatchlist(profileId);
  } else {
    // Check if film is already in watchlist
    const movieExists = watchlist.movies.some(movie => movie._id.toString() === movieId);
    if (filmExists) {
      throw new Error('La película ya está en la watchlist');
    }
  }
  
  // Add film to watchlist
  return await WatchlistRepository.addMovieToWatchlist(profileId, movieId);
};

export const removeFromWatchlist = async (profileId, movieId, userId) => {
  // Verify profile belongs to user
  const profile = await ProfileRepository.findProfileById(profileId, userId);
  if (!profile) {
    throw new Error('Perfil no encontrado');
  }
  
  // Get watchlist
  const watchlist = await WatchlistRepository.findWatchlistByProfile(profileId);
  
  if (!watchlist) {
    throw new Error('Watchlist no encontrada');
  }
  
  // Remove film from watchlist
  return await WatchlistRepository.removeMovieFromWatchlist(profileId, movieId);
};