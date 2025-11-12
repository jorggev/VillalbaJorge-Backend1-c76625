import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: "error", message: "Faltan campos requeridos" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ status: "error", message: "Email ya registrado" });

    // crear carrito para el usuario (opcional pero recomendado)
    const cart = new Cart();
    await cart.save();

    const hashed = User.createHash(password);
    const user = new User({
      first_name,
      last_name,
      email,
      age: age || 0,
      password: hashed,
      cart: cart._id
    });

    await user.save();
    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json({ status: "success", payload: safe });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// Login (genera JWT)
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const payload = { id: user._id, email: user.email, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "CHANGE_ME_SECRET", {
        expiresIn: process.env.JWT_EXPIRES || "1h"
      });
      return res.json({ status: "success", token, payload });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }
);

// Ruta /current protegida por JWT
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  // passport ya dejó el usuario en req.user (sin password por la estrategia)
  return res.json({ status: "success", payload: req.user });
});

export default router;