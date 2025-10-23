import express from 'express';
import ProductManager from '../ProductManager.js';
import uploader from '../utils/uploader.js';
import Product from '../models/product.model.js';

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

// Endpoint para subir imagen y devolver la ruta
productsRouter.post("/upload", uploader.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió archivo" });
    }
    res.json({ thumbnail: "/img/" + req.file.filename });
});

productsRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        //recupero los productos de la base de datos desde la propiedad payload
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: " Error al recuperar los datos" })
    }
})

productsRouter.post("/", async (req, res) => {
    try {
        const { title, price, stock } = req.body;

        const product = new Product({
            title,
            price,
            stock
        });
        await product.save();
        res.status(201).json({ status: "success", payload: product });

    } catch (error) {
        res.status(500).json({ status: "error", message: " Error al recuperar los datos" })
    }
});

productsRouter.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });

        if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        res.status(200).json({ status: "success", payload: updatedProduct })
    } catch (error) {
        res.status(500).json({ status: "error", message: " Error al recuperar los datos" })
    }
});


productsRouter.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await Product.findByIdAndDelete(pid);

        if (!deletedProduct) return res.status(404).json({ status: "success", message: "Prodcuto no encontrado" });

        res.status(200).json({ status: "success", payload: deletedProduct });

    } catch (error) {
        res.status(500).json({ status: "error", message: " Error al recuperar los datos" })
    }
});

export default productsRouter;