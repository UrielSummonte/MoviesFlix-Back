import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del perfil es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede tener más de 30 caracteres"],
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    type: {
      type: String,
      enum: {
        values: ["adult", "teen", "child"],
        message: "El tipo debe ser 'adult', 'teen' o 'child'",
      },
      default: "adult",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El perfil debe estar asociado a un usuario"],
      index: true,
    },
    ageRestriction: {
      type: Number,
      default: function () {
        if (this.type === "adult") return 18;
        if (this.type === "teen") return 13;
        return 7; // child
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para evitar nombres duplicados para el mismo usuario
profileSchema.index({ user: 1, name: 1 }, { unique: true });

// Método para actualizar la fecha de última actividad
profileSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save();
};

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
