import Review from "../models/Reviews.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";


export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ message: "Product Id and rating are required" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" })
        }
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        const hasOrdered = await Order.findOne({
            userId: req.user._id,
            "items.productId": productId,
        })
        if (!hasOrdered) {
            return res.status(403).json({ message: "You can only review products you have purchased" })
        }

        const review = await Review.create({
            userId: req.user._id,
            productId,
            rating,
            comment
        })
        res.status(201).json({ review })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You already reviewed this product" })
        }
        res.status(500).json({ message: error.message })
    }
}

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate("userId", "name")
            .sort({ createdAt: -1 })

        const averageRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

        res.status(200).json({
            reviews,
            averageRating: Number(averageRating.toFixed(1)),
            totalReviews: reviews.length,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: error.message })
        }

        const isOwner = review.userId.toString() === req.user._id.toString();
        if (!isOwner) {
            return res.status(403).json({ message: "Not authorized to edit this review" })
        }

        const { rating, comment } = req.body

        if (rating != null) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Rating must be between 1 and 5" })

            }
            review.rating = rating
        }
        if (comment != null) {
            review.comment = comment
        }
        const updated = await review.save()
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const review = await review.findById(req.params.id)

        if(!review){
            return res.status(404).json({message:"Review not found"})
        }

        const isOwner = review.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin"

        if(!isOwner && !isAdmin){
            return res.status(403).json({message:"Not authorized to delete this review"})
        }

        await review.deleteOne();
        res.status(200).json({message:"Review deleted"})
    } catch (error) {
        return res.status(200).json({message:error.message})
    }
}