import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

// GET all products
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET product by id
router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(product);
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update product
router.put("/:pid", async (req, res) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE product
router.delete("/:pid", async (req, res) => {
  try {
    const products = await productManager.deleteProduct(req.params.pid);
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
