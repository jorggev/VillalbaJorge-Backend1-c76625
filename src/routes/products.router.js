import express from 'express';
import ProductManager from '../ProductManager.js';
import uploader from '../utils/uploader.js';

const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

// Endpoint para subir imagen y devolver la ruta
productsRouter.post("/upload", uploader.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió archivo" });
    }
    res.json({ thumbnail: "/img/" + req.file.filename });
});

export default productsRouter;