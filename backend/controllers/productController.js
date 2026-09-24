import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const createProduct = async (req,res) => {
    try {
            const {name,description,price,stock,categoryId,images} = req.body

    if(!name||!description||!price == null ||!categoryId){
        return res.status(400).json({message:"missing required fields"})
    }

    const imagesUrls = req.files ? req.files.map((file)=>file.path) : [];

     const product = await Product.create(
        {
            name,
            description,
            price,
            stock: stock || 0,
            categoryId,
            images: imagesUrls,
        }
     )
     res.status(201).json(product)
    } catch (error) {
        res.status(500).json({message:error.message})
    }

}


const getCategoryAndDescendantIds = async (categoryId) => {
  const ids = [categoryId];

  const children = await Category.find({ parentId: categoryId });

  for (const child of children) {
    const childIds = await getCategoryAndDescendantIds(child._id);
    ids.push(...childIds);
  }

  return ids;
};

export const getProducts = async (req,res)=>{
    try {
        const {category, page=1, limit=12}=req.query;
        const filter ={}

        if (category) {
      const categoryIds = await getCategoryAndDescendantIds(category);
      filter.categoryId = { $in: categoryIds }; // match ANY of these IDs
    }

        const skip = (Number(page)-1)*Number(limit);

        const [products,total] = await Promise.all([
            Product.find(filter)
            .populate("categoryId","name slug")
            .skip(skip)
            .limit(Number(limit))
            .sort({createdAt: -1}),
            Product.countDocuments(filter),
        ])
        res.status(200).json({
            products,
            page:Number(page),
            totalPages:Math.ceil(total/Number(limit)),
            totalProducts: total,
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getProductById = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "categoryId",
            "name slug"
        );
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const updateProduct = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"No product found"})
        }
        const {name,description,price,stock,categoryId,images} = req.body

        product.name = name ?? product.name
        product.description = description ?? product.description
        product.price = price ?? product.price
        product.stock = stock ?? product.stock
        product.categoryId = categoryId ?? product.categoryId
        product.images = images ?? product.images

        if(req.files && req.files.length > 0){
            product.images = req.files.map((file)=>file.path)
        }

        const updated = await product.save();

        res.status(200).json(updated)
    } catch (error) {
        return res.status(404).json({message:error.message})
    }
}

export const deleteProduct = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({message:"Product not found"})
        }
        await product.deleteOne()
        res.status(200).json({message:" Product deleted"})
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}