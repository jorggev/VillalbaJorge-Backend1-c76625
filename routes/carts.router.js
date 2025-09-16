import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
// A newCartManager le pasamos la ruta del archivo JSON donde se almacenarán los carritos
const cartManager = new CartManager("./data/carts.json");

// POST para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET lista los productos que pertenecen al carrito con el cid proporcionado
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST agrega el producto al arreglo products del carrito seleccionado
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
