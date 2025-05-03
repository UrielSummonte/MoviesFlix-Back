import Watchlist from "../models/Watchlist.mjs"
import Profile from "../models/Profile.mjs"
import Movie from "../models/Movie.mjs"
import { getWatchlistForProfile, addToWatchlistService, removeMovieFromWatchlist } from '../services/watchlistService.mjs'
//import { equal } from "joi"

// Obtener watchlist para un perfil
// export async function getWatchlist(req, res, next) {
//   try {
//     const { profileId } = req.params    
    
//     // Verificar que el perfil pertenece al usuario
//     const profile = await Profile.findOne({
//       _id: profileId,
//       user: req.user.id,
//     })
    
//     if (!profile) {
//       return res.status(404).json({ message: "Perfil no encontrado" })
//     }

//     // Obtener watchlist con películas populadas
//     let watchlist = await Watchlist.findOne({ profile: profileId }).populate("movies")
    
//     // Si no existe watchlist, crear una
//     if (!watchlist) {
//       watchlist = new Watchlist({
//         profile: profileId,
//         movies: [],
//       })
//       await watchlist.save()
//       watchlist = await Watchlist.findOne({ profile: profileId }).populate("movies")
//     }

//     res.status(200).json({
//       ...watchlist.toObject(),
//       movies: watchlist,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

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

// Añadir película a watchlist
// export async function addToWatchlist(req, res, next) {
//   try {
//     const { profileId, movieId } = req.params

//     // Verificar que el perfil pertenece al usuario
//     const profile = await Profile.findOne({
//       _id: profileId,
//       user: req.user.id,
//     })

//     if (!profile) {
//       return res.status(404).json({ message: "Perfil no encontrado" })
//     }

//     // Verificar que la película existe
//     const movie = await Movie.findById(movieId)
        
//     if (!movie) {
//       return res.status(404).json({ message: "Película no encontrada" })
//     }

//     // Verificar si la película es apropiada para la restricción de edad del perfil
//     if (movie.ageRating > profile.ageRestriction) {
//       return res.status(403).json({
//         message: "Esta película no es apropiada para la restricción de edad de este perfil",
//       })
//     }

//     // Obtener o crear watchlist
//     let watchlist = await Watchlist.findOne({ profile: profileId })

//     if (!watchlist) {
//       watchlist = new Watchlist({
//         profile: profileId,
//         movies: [movieId],
//       })
//     } else {
//       // Verificar si la película ya está en la watchlist
//       if (watchlist.movies.includes(movieId)) {
//         return res.status(400).json({ message: "La película ya está en la watchlist" })
//       }

//       // Añadir película a la watchlist
//       watchlist.movies.push(movieId)
//     }

//     await watchlist.save()

//     // Devolver watchlist actualizada con películas populadas
//     const updatedWatchlist = await Watchlist.findOne({ profile: profileId }).populate("movies")

//     res.status(200).json(updatedWatchlist)
//   } catch (error) {
//     next(error)
//   }
// }


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


// Eliminar película de watchlist
// export async function removeFromWatchlist(req, res, next) {
//   try {
//     const { profileId, movieId } = req.params

//     // Verificar que el perfil pertenece al usuario
//     const profile = await Profile.findOne({
//       _id: profileId,
//       user: req.user.id,
//     })

//     if (!profile) {
//       return res.status(404).json({ message: "Perfil no encontrado" })
//     }

//     // Obtener watchlist
//     const watchlist = await Watchlist.findOne({ profile: profileId })

//     if (!watchlist) {
//       return res.status(404).json({ message: "Watchlist no encontrada" })
//     }

//     // Eliminar película de la watchlist
//     watchlist.movies = watchlist.movies.filter((movie) => movie.toString() !== movieId)

//     await watchlist.save()

//     // Devolver watchlist actualizada con películas populadas
//     const updatedWatchlist = await Watchlist.findOne({ profile: profileId }).populate("movies")

//     res.status(200).json(updatedWatchlist)
//   } catch (error) {
//     next(error)
//   }
// }

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