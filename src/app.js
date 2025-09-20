
import express from 'express';
import CartManager from './CartManager.js';
import ProductManager from './ProductManager.js';

const app = express();
app.use(express.json());


const cartManager = new CartManager();
const productManager = new ProductManager();

/* --------------api/products-------------- */


// Lista todos los productos.
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json(products);
});


// Trae solo el producto con el id proporcionado
app.get('/api/products/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.status(200).json(product);
});


// Crea un nuevo producto
app.post('/api/products', async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Actualiza un producto sin modificar el id
app.put('/api/products/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ message: 'Producto no encontrado' });
  res.status(200).json(updated);
});


// Elimina un producto por su id
app.delete('/api/products/:pid', async (req, res) => {
  const products = await productManager.deleteProduct(req.params.pid);
  res.status(200).json(products);
});

/* --------------api/carts-------------- */

// Crea un nuevo carrito
app.post('/api/carts', async (req, res) => {
  const carts = await cartManager.addCart();
  res.status(201).json({ carts, message: 'Carrito creado con éxito' });
});

// Listar los productos del carrito por su id
app.get('/api/carts/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const products = await cartManager.getProductsInCartById(cid);
  res.status(200).json({products, message: 'Lista de productos' })
});

// Agrega un producto al carrito por su id
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  const carts = await cartManager.addProductToCart(cid, pid, quantity);

  res.status(200).json({ carts, message: 'Producto agregado al carrito con éxito' })
});


app.listen(8080, () => {
  console.log(`Servidor escuchando en el puerto 8080`);
});
