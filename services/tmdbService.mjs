import axios from "axios"
import dotenv from 'dotenv';

dotenv.config();  // Carga las variables de entorno

// Configuración de la API de TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL_SEARCH = "https://api.themoviedb.org/3/search/movie"
const TMDB_BASE_URL_VIDEOS = "https://api.themoviedb.org/3/movie"; // Necesitamos el ID aquí


// Función para buscar película por título
export async function searchMovieByTitle(title) {
  try {
    // Codificar el título para que sea compatible con la URL
    const encodedTitle = encodeURIComponent(title);

    // Realizar la solicitud a la API de TMDb
    const response = await axios.get(TMDB_BASE_URL_SEARCH, {
      params: {
        api_key: TMDB_API_KEY,
        query: encodedTitle, // Usar el título que recibimos como parámetro
      },
    });

    // Retornar los resultados de la búsqueda
    return response.data;
  } catch (error) {
    console.error("Error al buscar la película:", error);
    throw error; // Lanza el error para que lo maneje el controlador
  }
}

// Función para buscar los trailers de una película por su ID
export async function getMovieTrailers(movieId) {
  try {
    const videosUrl = `${TMDB_BASE_URL_VIDEOS}/${movieId}/videos`;
    const response = await axios.get(videosUrl, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener los trailers de la película con ID ${movieId}:`, error);
    throw error;
  }
}
