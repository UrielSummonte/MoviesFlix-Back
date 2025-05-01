import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: (props) =>
          `${props.value} no es una dirección de email válida!`,
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracter"],
      maxlength: [50, "El nombre no puede tener mas de 50 caracteres"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "El rol debe ser user o admin",
      },
      default: "user",
    },
    // profiles: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Profile",
    //   },
    // ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const user = await this.constructor.findById(this._id).select("+password");

    if (!user || !user.password) {
      console.error("No se puede obtener la contraseña del usuario");
      return false;
    }

    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    console.error("Error comparando contraseñas", error);
    throw error;
  }
};

const User = mongoose.model("User", UserSchema);

export default User;
