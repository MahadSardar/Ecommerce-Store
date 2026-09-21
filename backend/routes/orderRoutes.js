import express from "express"
import { createOrder,getAllOrders,getOrderbyId,getMyOrders,updateOrderStatus } from "../controllers/orderController.js"
import {protect,adminOnly} from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/",protect,createOrder)
router.get("/my",protect,getMyOrders)
router.get("/",protect,adminOnly,getAllOrders)
router.get("/:id",protect,getOrderbyId)
router.put("/:id/status",protect,adminOnly,updateOrderStatus)

export default router;