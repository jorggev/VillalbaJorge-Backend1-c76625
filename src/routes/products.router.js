import express from "express";
import Product from "../models/product.model.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();

// Obtener todos los productos con paginación
productsRouter.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const data = await Product.paginate({}, { limit, page });
        const products = data.docs;
        delete data.docs;

        res.status(200).json({ status: "success", payload: products, ...data });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al recuperar los productos" });
    }
});

// Obtener un producto por su ID
productsRouter.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al recuperar los productos" });
    }
})

// Agregar un nuevo producto
productsRouter.post("/", async (req, res) => {
    try {
        const { title, description, image, price, stock, category } = req.body;

        if (!title || price === undefined) {
            return res.status(400).json({ status: "error", message: "title y price son requeridos" });
        }

        const product = new Product({
            title,
            description: description || "",
            thumbnail: image || "",
            price: Number(price),
            stock: Number(stock) || 0,
            category: category || ""
        });

        await product.save();
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar un producto" });
    }
});

// Actualizar un producto existente
productsRouter.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });
        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.status(200).json({ status: "success", payload: updatedProduct })
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al actualizar un producto" });
    }
});

// Eliminar un producto
productsRouter.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.status(200).json({ status: "success", payload: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar un producto" });
    }
});

export default productsRouter;