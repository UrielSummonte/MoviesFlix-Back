// document.addEventListener("DOMContentLoaded", function () {

//     // Configuración de la API de TMDB
// const TMDB_API_KEY = process.env.TMDB_API_KEY
// const TMDB_BASE_URL = "https://api.themoviedb.org/3"
//   const tmdbIdInput = document.getElementById("tmdbId");
//   const trailerUrlInput = document.getElementById("trailerURL");

//   tmdbIdInput.addEventListener("change", async function () {
//     const tmdbId = tmdbIdInput.value.trim();

//     if (tmdbId) {
//       // Llamada a la API de TMDB
//       const apiKey = "YOUR_TMDB_API_KEY"; // Asegúrate de usar tu propia clave API de TMDB
//       const url = `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${apiKey}&language=es`;

//       try {
//         const response = await fetch(url);
//         const data = await response.json();

//         // Si hay videos disponibles, obtener el trailer
//         const trailer = data.results.find((video) => video.type === "Trailer");
//         if (trailer) {
//           trailerUrlInput.value = `https://www.youtube.com/watch?v=${trailer.key}`;
//         } else {
//           trailerUrlInput.value = ""; // Si no hay trailer, dejar el campo vacío
//         }
//       } catch (error) {
//         console.error("Error al obtener el trailer:", error);
//       }
//     } else {
//       trailerUrlInput.value = ""; // Limpiar el campo si no se ha ingresado ID
//     }
//   });
// });


const form = document.getElementById('form');


  const genresGroup = document.getElementById('genresGroup');

  form.addEventListener('submit', function (e) {
    const checked = genresGroup.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length === 0) {
      e.preventDefault(); // Evita que se envíe
      alert('Debes seleccionar al menos un género.');
    }
  });