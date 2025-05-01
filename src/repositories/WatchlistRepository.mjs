import Watchlist from "../models/Watchlist.mjs";
import IWatchlistRepository from "./IWatchlistRepository.mjs";

class WatchlistRepository extends IWatchlistRepository {
  async addWatchlist(profileId) {
    try {
      const watchlist = new Watchlist({
        profile: profileId,
        films: [],
      });
      return await Watchlist.create();
    } catch (error) {
      console.error("Error al crear la watchlist:", error);
      throw error;
    }
  }

  async addMovieToWatchlist(profileId, movieId) {
    try {
      return await Watchlist.findOneAndUpdate(
        { profile: profileId},
        { $addToSet: { movies: movieId }},
        { new: true }
      ).populate('movies')
    } catch (error) {
      console.error("Error al insertar el film en la watchlist:", error);
      throw error;
    }
  }

  async removeMovieFromWatchlist(profileId, filmId) {
    try {
      return await Watchlist.findOneAndUpdate(
        { profile: profileId},
        { $pull: { movies: movieId }},
        { new: true }
      ).populate('movies')
    } catch (error) {
      console.error("Error al eliminar la película de la watchlist:", error);
      throw error;
    }
  }

  // async removeWatchlist(profileId, movieId) {
  //   try {
  //     return await Watchlist.findOneAndDelete({
  //       profile: profileId,
  //       movie: movieId,
  //     });
  //   } catch (error) {
  //     console.error("Error al crear la watchlist:", error);
  //     throw error;
  //   }
  // }

  // async existsWatchlist(profileId, movieId) {
  //   try {
  //     const item = await Watchlist.findOne({
  //       profile: profileId,
  //       movie: movieId,
  //     });
  //     return !!item;
  //   } catch (error) {
  //     console.error("Error al verificar en la watchlist:", error);
  //     throw error;
  //   }
  // }

  async findWatchlistByProfile(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId }).populate("movie");
    } catch (error) {
      console.error("Error al obtener la watchlist de un perfil:", error);
      throw error;
    }
  }

  // async getMovieIdsByProfile(profileId) {
  //   try {
  //     const items = await Watchlist.find({ profile: profileId }).select(
  //       "movie"
  //     );
  //     return items.map((item) => item.movie);
  //   } catch (error) {
  //     console.error(
  //       "Error al obtener los id de las pleículas de la watchlist:",
  //       error
  //     );
  //     throw error;
  //   }
  // }

  async removeWatchlistByProfile(profileId) {
    try {
      return await Watchlist.findOneAndDelete({ profile: profileId })
    } catch (error) {
      console.error("Error al eliminar la watchlist por profile:", error);
      throw error;
    }
  }
}

export default new WatchlistRepository();
