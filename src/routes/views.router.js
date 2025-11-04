import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();

// Ruta para la vista de productos con paginación
viewsRouter.get("/", async(req, res)=> {
  try{
    const { limit = 10, page = 1 } = req.query;

    const data = await Product.paginate({}, { limit, page, lean: true });
    const products = data.docs;
    delete data.docs;

    const links = [];
    for(let index = 1; index <= data.totalPages; index++){
      links.push({ text: index, link: `?limit=${limit}&page=${index}` });
    }

    res.render("home", { products, links });
  }catch(error){
    res.status(500).send({ message: error.message });
  }
});

// Ruta para la vista de productos en tiempo real
viewsRouter.get("/realtimeproducts", async(req, res)=> {
  res.render("realTimeProducts"); 
});

// Ruta para la vista de detalles de un producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetails", { product });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default viewsRouter;