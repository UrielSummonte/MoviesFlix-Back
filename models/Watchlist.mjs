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

const Watchlist = mongoose.model("Watchlist", watchlistSchema)

export default Watchlist
