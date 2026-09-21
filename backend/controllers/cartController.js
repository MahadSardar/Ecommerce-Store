import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({userId})
    if(!cart){
        cart = await Cart.create({userId, items:[]})
    }
    return cart
}

export const getCart = async (req,res)=>{
    try {
        const cart = await Cart.findOne({userId: req.user._id}).populate(
            "items.productId",
            "name price stock images"
        );
        if(!cart){
            return res.status(200).json({userId:req.user._id,items:[]})
        }
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const addToCart = async (req,res) => {
    try {
        const {productId,quantity = 1} = req.body

        if(!productId){
            return res.status(400).json({message:"ProductId is Required"})
        }

        const product = await Product.findById(productId)
        if(!product){
           return res.status(404).json({message:"Product not found"})
        }
        const cart = await getOrCreateCart(req.user._id)

        const existingItem = cart.items.find(
            (item)=>item.productId.toString() === productId
        );

        if(existingItem){
            existingItem.quantity += Number(quantity);
        }
        else{
            cart.items.push({productId, quantity:Number(quantity)})
        }
        await cart.save()

        const populatedCart = await cart.populate(
            "items.productId",
            "name price stock images"
        )
        res.status(200).json(populatedCart)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const updateCartItem = async (req,res) => {
    try {
        const {productId} = req.params;
        const {quantity} = req.body

        if(quantity == null || quantity < 1){
            return res.status(400).json({message:"Quantity must be atleast 1"})
        }

        const cart = await Cart.findOne({userId:req.user._id})
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        )

        if(!item){
            return res.status(404).json({message:"Item not found in cart"})
        }

        item.quantity = Number(quantity);
        await cart.save()

        const populatedCart = await cart.populate(
            "items.productId",
            "name price stock images"
        )
        res.status(200).json(populatedCart)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const removeFromCart= async (req,res) => {
    try {
        const {productId} = req.params;

        const cart = await Cart.findOne({userId:req.user._id})
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        )
        await cart.save()

        const populatedCart = await cart.populate(
            "items.productId",
            "name price stock images"
        )
        res.status(200).json({populatedCart})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const clearCart = async (req,res) => {
    try {
        const cart = await Cart.findOne({userId:req.user._id})
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        cart.items = []
        await cart.save()

        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}