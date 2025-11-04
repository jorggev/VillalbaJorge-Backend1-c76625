import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

// Definimos el esquema para los productos
const productSchema = new mongoose.Schema({
    title: String,
    description: { type: String, index: "text" },
    thumbnail: String,
    price: Number,
    stock: Number,
    category: { type: String, index: true },
    // Agregamos un campo 'code' único para que cada producto tenga un identificador único
    code: {
        type: String,
        unique: true,
        default: () => Date.now().toString(36) + Math.random().toString(36).slice(2)
    },

    status: {
        type: Boolean,
        default: true,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;