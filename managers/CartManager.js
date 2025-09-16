import crypto from "crypto";
import fs from "fs/promises";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeFile(carts) {
    await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
  }

  async createCart() {
    const carts = await this.readFile();
    const newCart = { id: crypto.randomUUID(), products: [] };
    carts.push(newCart);
    await this.writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.readFile();
    return carts.find((c) => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.readFile();
    const index = carts.findIndex((c) => c.id === cid);
    if (index === -1) throw new Error("Carrito no encontrado");

    const cart = carts[index];
    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    carts[index] = cart;
    await this.writeFile(carts);
    return cart;
  }
}

export default CartManager;
