// ------------------------------------------------------
// Modelo de usuario para XI-XI.
// - Soporta roles (ADMIN, CUSTOMER)
// - Encripta la contraseña antes de guardar
// ------------------------------------------------------
const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../utils/password");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Hook "pre save": se ejecuta antes de guardar el documento
UserSchema.pre("save", async function () {
  const user = this;

  // Si la contraseña no ha sido modificada, no la volvemos a encriptar
  if (!user.isModified("password")) {
    return;
  }

  // Encriptar la contraseña
  const hashed = await hashPassword(user.password);
  user.password = hashed;
});

// Método de instancia para comparar contraseñas
UserSchema.methods.comparePassword = function (plainPassword) {
  return comparePassword(plainPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
