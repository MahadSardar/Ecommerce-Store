import express from "express";
import { protect,adminOnly } from "../middlewares/authMiddleware.js";
import { createCategory,getCategories,updateCategories,deleteCategory } from "../controllers/categoryController.js";

const router = express.Router()

router.get("/",getCategories)
router.post("/",protect,adminOnly,createCategory)
router.put("/:id",protect,adminOnly,updateCategories)
router.delete("/:id",protect,adminOnly,deleteCategory)

export default router