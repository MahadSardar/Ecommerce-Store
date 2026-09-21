import Category from "../models/Category.js";

export const createCategory = async (req,res) => {
    try {
        const {name,slug,parentId}=req.body;

        if(!name||!slug){
            return res.status(400).json({message:"Name and slug are required"});
        }
        const category = await Category.create({
            name,
            slug,
            parentId:parentId || null,
        })
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getCategories = async (req,res) => {
    try {
        const categories = await Category.find().sort({name:1})
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const updateCategories = async (req,res)=>{
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"})
        }
        const {name,slug,parentId}= req.body;

        category.name = name ?? category.name;
        category.slug = slug ?? category.slug;
        category.parentId = parentId ?? category.parentId

        const updated = await category.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const deleteCategory = async(req,res)=>{
    try {
        const category = await Category.findById(req.params.id);
        if(!category){
            return res.status(404).json({message:"Category not found"})
        }
        await category.deleteOne();
        res.status(200).json({message:"Category deleted"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}