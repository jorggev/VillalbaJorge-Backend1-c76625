import express from "express";
import productsRouter from "./routes/products.router.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import cors from "cors";
import __dirname from "../dirname.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";

//inicializamos las variables de entorno
dotenv.config({ path: __dirname + "/.env" });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
//  para parsear formularios HTML
app.use(express.urlencoded({ extended: true })); 
//habilitamos nuestra carpeta public para recursos estaticos
app.use( express.static( __dirname + "/public") );
//en el caso de que tengan un front externo
app.use(cors());

connectMongoDB();

// inicializar passport
initializePassport(passport);
app.use(passport.initialize());

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

//endpoints
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/sessions", sessionsRouter); // <-- nueva ruta
app.use("/", viewsRouter);

app.listen(PORT, ()=> {
  console.log("Servidor iniciado correctamente!");
})