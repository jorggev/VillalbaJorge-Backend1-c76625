import express from "express";
import Cart from "../models/cart.model.js";

const cartRouter = express.Router();

// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();

    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Obtener los productos de un carrito
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Agregar un producto al carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = Number(req.body.quantity) || 1;

    // Si existe entrada para ese producto, sumamos cantidad; si no, agregamos
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const existing = cart.products.find(p => String(p.product) === String(pid));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    const populated = await Cart.findById(cid).populate("products.product");
    res.status(200).json({ status: "success", payload: populated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = Number(req.body.quantity);
    if (isNaN(quantity) || quantity < 0) return res.status(400).json({ status: "error", message: "Quantity invalida" });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const entry = cart.products.find(p => String(p.product) === String(pid));
    if (entry) {
      if (quantity === 0) {
        cart.products = cart.products.filter(p => String(p.product) !== String(pid));
      } else {
        entry.quantity = quantity;
      }
    } else {
      if (quantity > 0) cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    const populated = await Cart.findById(cid).populate("products.product");
    res.status(200).json({ status: "success", payload: populated });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Eliminar un producto del carrito
cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await Cart.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true, runValidators: true }).populate("products.product");
    res.status(200).json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default cartRouter;