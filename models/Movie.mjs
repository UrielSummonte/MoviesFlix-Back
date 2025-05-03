import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    original_title: {
      type: String,
      required: [true, "El título original es obligatorio"],
      trim: true,
      minlength: [1, "El título debe tener al menos 1 caracter"],
      maxlength: [100, "El título no puede tener mas de 100 caracteres"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [1, "El título debe tener al menos 1 caracter"],
      maxlength: [100, "El título no puede tener mas de 100 caracteres"],
      index: true,
    },
    original_language: {
      type: String,
      required: [true, "El lenguaje original es obligatorio"],
      trim: true,
      minlength: [1, "El lenguaje original debe tener al menos 1 caracter"],
      maxlength: [4, "El lenguaje original no puede tener mas de 4 caracteres"],
    },
    overview: {
      type: String,
      required: [true, "La reseña es obligatoria"],
      minlength: [10, "La reseña debe tener al menos 10 caracteres"],
    },
    poster_path: {
      type: String,
      required: [true, "El póster es obligatorio"],
      validate: {
        validator: (v) => {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            v
          );
        },
        message: (props) =>
          `${props.value} no es una URL válida para el póster`,
      },
    },
    trailerURL: {
      type: String,
      validate: {
        validator: (v) => {
          return (
            !v || 
            /^(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=.+)/.test(v)
          );
        },
        message: (props) =>
          `${props.value} no es una URL válida para el trailer`,
      },
    },
    
    tmdbId: {
      type: Number,
      unique: true,
      sparse: true,
      validate: {
        validator: (v) => {
          return v === undefined || v === null || v > 0;
        },
        message: (props) => `${props.value} no es un ID de TMDB válido`,
      },
    },
    release_date: {
      type: Date,
      validate: {
        validator: (v) => {
          return !v || !isNaN(new Date(v).getTime());
        },
        message: (props) => `${props.value} no es una fecha válida`,
      },
      get: (date) => {
        if (date) {
          const parsedDate = new Date(date);
          if (isNaN(parsedDate)) return null;
      
          const day = parsedDate.getDate().toString().padStart(2, '0');
          const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
          const year = parsedDate.getFullYear();
          return `${year}-${month}-${day}`;
        }
        return null;
      },
      set: (dateString) => {
        if (dateString) {
          const parts = dateString.split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
          }
        }
        return dateString;
      },
    },
    genres: {
      type: [String],
      required: [true, "Al menos un género es obligatorio"],
      validate: {
        validator: (v) =>
          Array.isArray(v) &&
          v.length > 0 &&
          v.every(
            (genre) => typeof genre === "string" && genre.trim().length > 0
          ),
        message: (prosps) =>
          `Los géneros deben ser un array no vacio de strings`,
      },
    },
    rating: {
      type: String,
      enum: {
        values: ["G", "PG", "PG-13", "R", "NC-17"],
        message: "La clasificación debe ser G, PG, PG-13, R o NC-17",
      },
      required: [true, "La clasificación es obligatoria"],
    },
    vote_average: { type: Number, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, 
    toObject: { getters: true }, 
  }
);


movieSchema.index({ title: "text", original_title: "text", overview: "text" });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;