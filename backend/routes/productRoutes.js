import express from "express"
import { createProduct,getProductById,getProducts,updateProduct,deleteProduct } from "../controllers/productController.js"
import { protect,adminOnly } from "../middlewares/authMiddleware.js"
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/",getProducts)
router.get("/:id",getProductById)
router.post("/",protect,adminOnly,upload.array("images",5),createProduct)
router.put("/:id",protect,adminOnly,upload.array("images",5),updateProduct)
router.delete("/:id",protect,adminOnly,deleteProduct)

export default router;