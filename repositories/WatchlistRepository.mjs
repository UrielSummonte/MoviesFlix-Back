import Watchlist from "../models/Watchlist.mjs";
import IWatchlistRepository from "./IWatchlistRepository.mjs";

class WatchlistRepository extends IWatchlistRepository {
  // async createEmptyWatchlist(profileId) {
  //   const newWatchlist = new Watchlist({ profile: profileId, movies: [] })
  //   await newWatchlist.save()
  //   return await findWatchlistByProfile(profileId)
  // }

  async createEmptyWatchlist(profileId) {
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

  async create(data) {
    try {
      const watchlist = new Watchlist(data);
      return await watchlist.save();
    } catch (error) {
      throw new Error("Error al crear la watchlist");
    }
  }

  async save(watchlist) {
    try {
      return await watchlist.save();
    } catch (error) {
      throw new Error("Error al guardar la watchlist");
    }
  }

  async findByProfile(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId });
    } catch (error) {
      throw new Error("Error al buscar la watchlist");
    }
  }

  async findWithMovies(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId }).populate("movies");
    } catch (error) {
      throw new Error("Error al obtener la watchlist con películas");
    }
  }






  

  async addMovieToWatchlist(profileId, movieId) {
    try {
      return await Watchlist.findOneAndUpdate(
        { profile: profileId },
        { $addToSet: { movies: movieId } },
        { new: true }
      ).populate("movies");
    } catch (error) {
      console.error("Error al insertar el film en la watchlist:", error);
      throw error;
    }
  }

  async removeMovieFromWatchlist(profileId, filmId) {
    try {
      return await Watchlist.findOneAndUpdate(
        { profile: profileId },
        { $pull: { movies: movieId } },
        { new: true }
      ).populate("movies");
    } catch (error) {
      console.error("Error al eliminar la película de la watchlist:", error);
      throw error;
    }
  }

  async findWatchlistByProfile(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId }).populate("movies");
    } catch (error) {
      console.error("Error al obtener la watchlist de un perfil:", error);
      throw error;
    }
  }

  async removeWatchlistByProfile(profileId) {
    try {
      return await Watchlist.findOneAndDelete({ profile: profileId });
    } catch (error) {
      console.error("Error al eliminar la watchlist por profile:", error);
      throw error;
    }
  }
}

export default new WatchlistRepository();
