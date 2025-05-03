import mongoose from "mongoose"

const watchlistSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: [true, "El perfil es obligatorio"],
      index: true,
    },
    movies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    }],
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Índice compuesto para evitar duplicados y búsquedas eficientes
watchlistSchema.index({ profile: 1, movies: 1 }, { unique: true })

// Validación para verificar que la película existe
// watchlistSchema.pre("save", async function (next) {
//   try {
//     const Movie = mongoose.model("Movie")
//     const movie = await Movie.findById(this.movie)
//     if (!movie) {
//       const error = new Error("La película no existe")
//       error.statusCode = 404
//       return next(error)
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

// Validación para verificar que el perfil existe
// watchlistSchema.pre("save", async function (next) {
//   try {
//     const Profile = mongoose.model("Profile")
//     const profile = await Profile.findById(this.profile)
//     if (!profile) {
//       const error = new Error("El perfil no existe")
//       error.statusCode = 404
//       return next(error)
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

const Watchlist = mongoose.model("Watchlist", watchlistSchema)

export default Watchlist
