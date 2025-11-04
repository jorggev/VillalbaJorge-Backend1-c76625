import mongoose from "mongoose";

// Definimos el esquema para el carrito de compras
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
                quantity: { type: Number}
            }
        ],
        default: []
    }, 
    created_at: {type: Date, default: Date.now()}
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
