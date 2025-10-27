import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: { type: String, index: "text" },
  thumbnail: String,
  price: Number,
  stock: Number,
  category: { type: String, index: true },
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

// le pasamos nombre y el esquema que debe respetar
const Product = mongoose.model("Product", productSchema);
// de esta manera podemos acceder al modelo en otras partes de la app

export default Product;