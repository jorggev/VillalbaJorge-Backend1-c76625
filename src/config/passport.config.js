import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export default function initializePassport(passport) {
  // Local strategy para login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password", session: false },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email }).exec();
          if (!user) return done(null, false, { message: "Usuario no existe" });
          const valid = User.isValidPassword(user, password);
          if (!valid) return done(null, false, { message: "Invalid credentials" });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // JWT strategy
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || "CHANGE_ME_SECRET"
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id).select("-password").exec();
          if (!user) return done(null, false, { message: "Token no válido" });
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}