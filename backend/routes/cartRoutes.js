import express from "express"
import { getCart,addToCart,updateCartItem,removeFromCart,clearCart } from "../controllers/cartController.js"
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/",protect,getCart)
router.post("/",protect,addToCart)
router.put("/:productId",protect,updateCartItem)
router.delete("/:productId",protect,removeFromCart)
router.delete("/",protect,clearCart)

export default router

