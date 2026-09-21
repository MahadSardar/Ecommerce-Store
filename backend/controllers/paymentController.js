import stripe from "../config/stripe.js"
import Order from "../models/Order.js"


export const createCheckoutSession = async (req,res) => {
    try {
        const {orderId} = req.body
        if(!orderId){
            return res.status(400).json({message:"Order is required"})
        }
        const order = await Order.findById(orderId).populate(
            "items.productId",
            "name images"
        );
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        const isOwner = order.userId.toString() === req.user._id.toString()
        if(!isOwner){
            return res.status(403).json({message:"Not authorized for this order"})
        }

        if(order.paymentStatus === "paid"){
            return res.status(400).json({message:"The order is already paid"})
        }

        const line_items = order.items.map((item)=>({
            price_data:{
                currency:"usd",
                product_data:{
                    name:item.productId?.name || "Product",
                },
                unit_amount: Math.round(item.priceAtPurchase*100),
            },
            quantity: item.quantity,
        }))

        const session = await stripe.checkout.sessions.create({
            mode:"payment",
            payment_method_types:["card"],
            line_items,
            success_url:`${process.env.CLIENT_URL}/order-success?orderId=${order._id}`,
            cancel_url: `${process.env.CLIENT_URL}/order-cancelled?orderId=${order._id}`,
            metadata:{
                orderId:order._id.toString(),
            },
        });
        res.status(200).json({url: session.url})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const handleStripeWebhook = async (req,res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Webhook signature verification failed:",error.message)
        return res.status(400).send(`Webhook Error:${error.message}`);
    }

    if(event.type === "checkout.session.completed"){
        const session = event.data.object;
        const orderId = session.metadata.orderId

        try {
            await Order.findByIdAndUpdate(orderId,{
                paymentStatus:"paid",
            })
            console.log(`Order ${orderId} marked as paid`)
        } catch (error) {
            console.error("Failed to update order after payment:",error.message)
        }
    }
    res.status(200).json({received:true});
}