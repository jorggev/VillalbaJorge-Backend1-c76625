import mongoose from "mongoose";

//esquema de datos de los productos
const productSchema = new mongoose.Schema({
    title: String,
    description: {type: String, index: "text"},
    thumbnail: {type: String, default: ""},
    code: {type: String, unique: true},
    price: Number,
    stock: Number,
    category: {type: String, index: true},
    status: {
        type: Boolean,
        default: true,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
}
);

// le pasamos nombre y el esquema que debe respetar
const Product = mongoose.model("Product", productSchema);
// de esta manera podemos acceder al modelo en otras partes de la app

export default Product;