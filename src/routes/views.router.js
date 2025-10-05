import express from 'express';
import ProductManager from '../ProductManager.js';

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");


viewsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

/* viewsRouter.get("/dashboard", async (req, res) => {
    const user = { username: "Gustavito11", isAdmin: true };
    const products = await productManager.getProducts();
    res.render("dashboard", { products, user });
}); */

viewsRouter.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default viewsRouter;