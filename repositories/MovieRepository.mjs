import Movie from "../models/Movie.mjs";
import IMovieRepository from "./IMovieRepository.mjs";

class MovieRepository extends IMovieRepository {

    // Repositorio para crear una movie
    async createMovie(movieData) {
        try {
          return await Movie.create(movieData);
        } catch (error) {
          console.error("Error al insertar la movie:", error);
          throw error;
        }
      }

  // Repositorio para find una movie por id
  async findMovieById(id) {
    try {
      return await Movie.findById(id);
    } catch (error) {
      console.error("Error al obtener la movie por id:", error);
      throw error;
    }
  }

  // Repositorio para find un TMDBId movie
  async findMovieTMDBById(TMDBId) {
    try {
      return await Movie.findOne({ tmdbId: TMDBId });
    } catch (error) {
      console.error("Error al obtener la movie por TMDB id:", error);
      throw error;
    }
  }

  // Repositorio para editar una movie
  async updateMovieById(id, movieData) {
    try {
      return await Movie.findByIdAndUpdate(
        { _id: id }, 
        { $set: movieData }, 
        { new: true } 
      );
    } catch (error) {
      console.error("Error al editar la movie:", error);
      throw error;
    }
  }

  // Repositorio para eliminar una movie
  async deleteMovieById(id) {
    try {
      return await Movie.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error("Error al eliminar la movie por id:", error);
      throw error;
    }
  }

  // Repositorio para traer movies con paginado y filtros
  async getMovies(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    try {
        const skip = (page - 1) * limit;
        const movies = await Movie.find(filter).sort(sort).skip(skip).limit(limit);
        const total = await Movie.countDocuments(filter);

        return {
            movies,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error("Error al obtener las movies:", error);
        throw error;
    }
}

}

export default new MovieRepository();
