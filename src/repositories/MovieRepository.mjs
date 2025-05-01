import Movie from "../models/Movie.mjs";
import IMovieRepository from "./IMovieRepository.mjs";

class MovieRepository extends IMovieRepository {

    async createMovie(movieData) {
        try {
          return await Movie.create(movieData);
        } catch (error) {
          console.error("Error al insertar la movie:", error);
          throw error;
        }
      }

  async findMovieById(id) {
    try {
      return await Movie.findById(id);
    } catch (error) {
      console.error("Error al obtener la movie por id:", error);
      throw error;
    }
  }

  async findMovieTMDBById(TMDBId) {
    try {
      return await Movie.findOne({ tmdbId: TMDBId });
    } catch (error) {
      console.error("Error al obtener la movie por TMDB id:", error);
      throw error;
    }
  }

  async updateMovieById(id, movieData) {
    try {
      // Usamos findOneAndUpdate con { new: true } para obtener el documento actualizado
      return await Movie.findByIdAndUpdate(
        // Filtro por id
        { _id: id }, 
        // Datos a actualizar
        { $set: movieData }, 
        // Devuelve el documento actualizado
        { new: true } 
      );
    } catch (error) {
      console.error("Error al editar la movie:", error);
      throw error;
    }
  }

  async deleteMovieById(id) {
    try {
      // Usamos findByIdAndDelete para obtener el documento actualizado
      return await Movie.findByIdAndDelete({ _id: id });
    } catch (error) {
      console.error("Error al eliminar la movie por id:", error);
      throw error;
    }
  }

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

  async findMoviesByText(query) {
    try {
        return await Movie.find( { $text: { $search: query } }).limit(10);
      } catch (error) {
        console.error("Error al buscar movies por texto:", error);
        throw error;
      }
  }

  async getMoviesByGenre(genre, limit = 10) {
    try {
        return await Movie.find( { genres: { $in: [genre] } } ).limit(limit);
      } catch (error) {
        console.error("Error al buscar movies por genero:", error);
        throw error;
      }
  }

  // async findMoviesForAge(maxAge) {
  //   return await Movie.find({ ageRating: { $lte: maxAge } }).sort({ createdAt: -1 })
  // }

}

export default new MovieRepository();
