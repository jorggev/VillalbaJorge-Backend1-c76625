
import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = './src/products.json';
    }


    // Obtiene todos los productos
    async getProducts() {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    // Obtiene un producto por su id
    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => String(p.id) === String(id));
        return product || null;
    }

    // Crea un nuevo producto
    async addProduct(productData) {
        const products = await this.getProducts();
        // Generar id autoincrementable
        let newId = 1;
        if (products.length > 0) {
            const lastId = products[products.length - 1].id;
            newId = typeof lastId === 'number' ? lastId + 1 : parseInt(lastId) + 1;
        }
        const product = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails
        };
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        return product;
    }

    // Actualiza un producto sin modificar el id
    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index === -1) return null;
        // No permitir modificar el id
        const { id: _, ...dataToUpdate } = updateData;
        products[index] = { ...products[index], ...dataToUpdate };
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
        return products[index];
    }

    // Elimina un producto por su id
    async deleteProduct(id) {
        const products = await this.getProducts();
        const filtered = products.filter(p => String(p.id) !== String(id));
        await fs.promises.writeFile(this.path, JSON.stringify(filtered, null, 2), 'utf-8');
        return filtered;
    }
}

export default ProductManager;