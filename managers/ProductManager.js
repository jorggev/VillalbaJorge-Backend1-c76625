import crypto from "crypto";
import fs from "fs/promises";

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeFile(products) {
    await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");
  }

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find((p) => p.id === id);
  }

  async addProduct(newProduct) {
    const products = await this.#readFile();

    // Validación de campos obligatorios
    const requiredFields = ["title", "description", "code", "price", "status", "stock", "category"];
    for (const field of requiredFields) {
      if (!newProduct[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    const product = {
      id: crypto.randomUUID(),
      title: newProduct.title,
      description: newProduct.description,
      code: newProduct.code,
      price: newProduct.price,
      status: newProduct.status,
      stock: newProduct.stock,
      category: newProduct.category,
      thumbnails: newProduct.thumbnails || []
    };

    products.push(product);
    await this.#writeFile(products);
    return product;
  }

  async updateProduct(id, updateData) {
    const products = await this.#readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado");

    // No permitir modificar el id
    const { id: _, ...dataToUpdate } = updateData;

    products[index] = { ...products[index], ...dataToUpdate };
    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const filtered = products.filter((p) => p.id !== id);
    await this.#writeFile(filtered);
    return filtered;
  }
}

export default ProductManager;
