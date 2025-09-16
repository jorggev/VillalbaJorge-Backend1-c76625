import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./data/carts.json");

// POST create cart
router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// GET cart by id
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json(cart);
});

// POST add product to cart
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
