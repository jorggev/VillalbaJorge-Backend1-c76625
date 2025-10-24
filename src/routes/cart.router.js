import express from "express";
import Cart from "../models/cart.model";

const cartRouter = express.Router();

cartRouter.post("/", async (res, req)=> {
    try {
        const cart = new Cart();
        await cart.save();

        res.statusCode(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.statusCode(500).json({ status: "error", message: error.message })
    }
});

cartRouter.post("/:cid/product//:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const {quantity} = req.body;

        const updatedCart = await Cart.findByIdAndUpdate(cid, {$push: { products: {product: pid, quantity}}}, {new: true, runValidators: true} );

        res.status(200).json({ status: "success", payload: updatedCart})
    } catch (error) {
        res.statusCode(500).json({ status: "error", message: error.message })
    }
})

export default cartRouter;