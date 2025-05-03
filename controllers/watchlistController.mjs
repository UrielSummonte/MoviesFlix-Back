import { getWatchlistForProfile, addToWatchlistService, removeMovieFromWatchlist } from '../services/watchlistService.mjs'


// Controlador para obtener una watchlist
export async function getWatchlist(req, res, next) {
  try {
    const { profileId } = req.params
    const userId = req.user.id

    const watchlist = await getWatchlistForProfile(profileId, userId)
    res.status(200).json({
             ...watchlist.toObject(),
             movies: watchlist,
           })
  } catch (error) {
    next(error)
  }
}

// Controlador para agregar un movie a una watchlist
export async function addToWatchlist(req, res, next) {
  try {
    const { profileId, movieId } = req.params
    const userId = req.user.id

    const result = await addToWatchlistService(userId, profileId, movieId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

// Controlador para eliminar una movie de una watchlist
export async function removeFromWatchlist(req, res, next) {
  try {
    const { profileId, movieId } = req.params;
    const userId = req.user.id;

    const updatedWatchlist = await removeMovieFromWatchlist(
      profileId,
      movieId,
      userId
    );
    
    res.status(200).json(updatedWatchlist);
  } catch (error) {
    next(error);
  }
}