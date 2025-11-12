import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, default: 0 },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: false },
  role: { type: String, default: "user" }
});

// helper para hashear y verificar
userSchema.statics.createHash = function (password) {
  const saltRounds = 10; // puedes cambiar si hace falta
  return bcrypt.hashSync(password, saltRounds);
};

userSchema.statics.isValidPassword = function (user, password) {
  return bcrypt.compareSync(password, user.password);
};

const User = mongoose.model("User", userSchema);
export default User;