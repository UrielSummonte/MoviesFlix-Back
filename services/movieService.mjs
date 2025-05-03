import MovieRepository from "../repositories/MovieRepository.mjs";
import { createError } from '../utils/errorUtil.mjs'

export async function getMovies(page = 1, limit = 10, filters = {}) {
    try {
        const filter = {}

        if (filters.genre) {
            filter.genres = { $in: [filters.genre] }
        }

        if (filters.profileType === "child") {
            filter.rating = { $in: ["G", "PG"] }
        } else if (filters.profileType === "teen") {
            filter.rating = { $in: ["G", "PG", "PG-13"] }
        }

        if (filters.search) {
            filter.$text = { $search: filters.search}
        }

        return await MovieRepository.getMovies(filter, page, limit);

    } catch (error) {
        console.error("Error al obtener las películas en el servicio:", error);
        throw error;
    }
}

export async function getPopularMovies(profileType) {
    try {
        const filter = {}

        if (profileType === "child") {
            filter.rating = { $in: ["G", "PG"] }
        } else if (profileType === "teen") {
            filter.rating = { $in: ["G", "PG", "PG-13"] }
        }

        const { movies } = await MovieRepository.getMovies(filter, 1, 10, { createdAt: -1})

        return movies;

    } catch (error) {
        console.error("Error al obtener las películas en el servicio:", error);
        throw error;
    }
}

export async function findMovieById(movieId) {
    try {
        return await MovieRepository.findMovieById(movieId);
    } catch (error) {
        console.error("Error al obtener la película por ID en el servicio:", error);
        throw error;
    }
}

export async function findMoviesByText(query) {
    try {
        if (!query) {
            throw createError(400, "Se requiere un término de búsqueda")
        }
        return await MovieRepository.findMoviesByText(query);
    } catch (error) {
        console.error("Error al buscar películas por texto en el servicio:", error);
        throw error;
    }
}

    export async function createMovie(movieData) {
        try {
            if (movieData.TMDBId) {
                const existingMovie = await MovieRepository.findMovieTMDBById(movieData.TMDBId)
                if (existingMovie) {
                    throw createError(400, "Ya existe una película con este Id de TMDB")
                }
            }

            if (movieData.TMDBId && !movieData.trailerUrl) {
                const trailer = await fetchTrailerFromTMDB(movieData.TMDBId)
                if (trailer) {
                    movieData.trailerUrl = trailer
                }
            }
            // Aquí podrías agregar lógica de negocio o validaciones antes de guardar
            return await MovieRepository.createMovie(movieData);
        } catch (error) {
            console.error("Error al crear la película en el servicio:", error);
            throw error;
        }
    }

    export async function updateMovieById(movieId, movieData) {
        const movie = await MovieRepository.findMovieById(movieId)

        if (!movie) {
            throw createError(404, "Película no encontrada")
        }

        if (movieData.TMDBId && movieData.TMDBId !== movie.tmdbId && !movieData.trailerUrl) {
            try {
                const trailer = await fetchTrailerFromTDB(movieData.tmdbId)
                if (trailer) {
                    movieData.trailerUrl = trailer
                }
            } catch (error) {
                console.error("Error obteniendo el trailer", error)
            }
        }
        
            return await MovieRepository.updateMovieById(movieId, movieData);
    }

    export async function deleteMovieById(movieId) {
        try {
            const movie = await MovieRepository.findMovieById(movieId)

            if (!movie) {
                throw createError(404, "Película no encontrada")
            }

            return await MovieRepository.deleteMovieById(movieId);
        } catch (error) {
            console.error("Error al eliminar la película en el servicio:", error);
            throw error;
        }
    }

    
