import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import ProductManager from "./ProductManager.js";
import connectMongoDB from "./config/db.js";
import dotenv from "dotenv";

// inicializamos las variables de entorno
dotenv.config();

const app = express();
const httpServer = app.listen(process.env.PORT, () => {
    console.log("Servidor corrieendo en el puerto 3000");
});

const io = new Server(httpServer);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectMongoDB();

// handlebars configuration
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// socket.io config
const productManager = new ProductManager("./src/products.json");

io.on("connection", async (socket) => {
    // Enviar productos actuales al conectar
    const products = await productManager.getProducts();
    socket.emit("products", products);

    // Agregar producto desde el cliente
    socket.on("addProduct", async (data) => {
        await productManager.addProduct(data);
        const updatedProducts = await productManager.getProducts();
        io.emit("products", updatedProducts);
    });

    // Eliminar producto desde el cliente
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProductById(id);
        const updatedProducts = await productManager.getProducts();
        io.emit("products", updatedProducts);
    });
});

export { io };