import express from "express";
import Product from "../models/product.model.js";
import passport from "passport";

const viewsRouter = express.Router();

// Ruta para la vista de productos
viewsRouter.get("/", async (req, res) => {
  try {
    console.log("TRACE: home handler start");
    const { limit = 10, page = 1 } = req.query;

    console.log("TRACE: calling Product.paginate", { limit, page });
    const data = await Product.paginate({}, { limit: Number(limit), page: Number(page), lean: true });
    console.log("TRACE: Product.paginate returned");

    const products = data.docs || [];
    delete data.docs;

    const links = [];
    for (let i = 1; i <= (data.totalPages || 1); i++) {
      links.push({ text: i, link: `/?limit=${limit}&page=${i}` });
    }

    console.log("TRACE: rendering home view");
    res.render("home", { products, links });
    console.log("TRACE: render called");
  } catch (error) {
    console.error("Error rendering home view:", error);
    res.status(500).send("Error interno al renderizar home");
  }
});

// Vista realtime
viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

// Vista detalle de producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetails", { product });
  } catch (error) {
    console.error("Error product details:", error);
    res.status(500).send("Error interno");
  }
});

// Login (form)
viewsRouter.get("/login", (req, res) => {
  res.render("login");
});

// Profile
viewsRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

// Añadir ruta GET /register para renderizar la vista de registro
viewsRouter.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error("Error rendering register view:", error);
    res.status(500).send("Error interno");
  }
});

export default viewsRouter;