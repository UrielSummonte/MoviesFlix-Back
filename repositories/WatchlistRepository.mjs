import Watchlist from "../models/Watchlist.mjs";
import IWatchlistRepository from "./IWatchlistRepository.mjs";

class WatchlistRepository extends IWatchlistRepository {

  // Repositorio para crear una watchlist vacia
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

  // Repositorio para crear una watchlsit
  async create(data) {
    try {
      const watchlist = new Watchlist(data);
      return await watchlist.save();
    } catch (error) {
      throw new Error("Error al crear la watchlist");
    }
  }

  // Repositorio para guardar una watchlist
  async save(watchlist) {
    try {
      return await watchlist.save();
    } catch (error) {
      throw new Error("Error al guardar la watchlist");
    }
  }

  // Repositorio para encontrar una watchlis por profile
  async findByProfile(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId });
    } catch (error) {
      throw new Error("Error al buscar la watchlist");
    }
  }

  // Repositorio para movies en la wathclist
  async findWithMovies(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId }).populate("movies");
    } catch (error) {
      throw new Error("Error al obtener la watchlist con películas");
    }
  }
 
  // Repositorio para agregar movie a la watchlist
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

  // Repositorio para eliminar movie de la watchlist
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

  // Repositorio para encontrar una watchlist por profile
  async findWatchlistByProfile(profileId) {
    try {
      return await Watchlist.findOne({ profile: profileId }).populate("movies");
    } catch (error) {
      console.error("Error al obtener la watchlist de un perfil:", error);
      throw error;
    }
  }

  // Repositorio para eliminar una watchlist por profile
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
