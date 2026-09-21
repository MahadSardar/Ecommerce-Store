import Order from "../models/Order.js"
import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

export const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate(
            "items.productId"
        )
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your carty is empty" })
        }

        const orderItems = []
        let total = 0

        for (const item of cart.items) {
            const product = item.productId

            if (!product) {
                return res.status(400).json({ message: "A Product in your cart no longer exists" })
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock fro ${product.name}.Available ${product.stock}`
                })
            }
            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            })
            total += product.price * item.quantity
        }


        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.quantity }
            })
        }

        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            total,
            paymentStatus: "pending",
            orderStatus: "processing"
        })

        cart.items = []
        await cart.save();

        res.status(201).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate("items.productId", "name images")
            .sort({ createdAt: -1 });

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getOrderbyId = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "items.productId",
            "name images"
        )
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        const isOwner = order.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to view this order" })
        }
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("items.productId", "name images")
            .sort({ createdAt: -1 })

        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const validStatuses = ["processing", "shipped", "delivered", "cancelled"];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" })
        }
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}