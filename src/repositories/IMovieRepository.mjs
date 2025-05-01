class IMovieRepository {
  createMovie() {
    throw new Error("Método 'createMovie()' no implementado");
  }
  findMovieById() {
    throw new Error("Método 'findMovieById()' no implementado");
  }
  findMovieTMDBById() {
    throw new Error("Método 'findMovieTMDBById()' no implementado");
  }
  updateMovieById() {
    throw new Error("Método 'updateMovieById()' no implementado");
  }
  deleteMovieById() {
    throw new Error("Método 'deleteMovieById()' no implementado");
  }
  getMovies() {
    throw new Error("Método 'getMovies()' no implementado");
  }
  findMoviesByText() {
    throw new Error(
      "Método 'findMoviesByText()' no implementado"
    );
  }
  getMoviesByGenre() {
    throw new Error(
      "Método 'getMoviesByGenre()' no implementado"
    );
  }  
  findMoviesForAge() {
    throw new Error(
      "Método 'findMoviesForAge()' no implementado"
    );
  }  
}

export default IMovieRepository;
