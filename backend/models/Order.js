import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        priceAtPurchase:{
            type:Number,
            required:true,
        },
    },
    {_id: false}
);

const orderSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        items:{
            type:[orderItemSchema],
            required:true,
        },
        paymentStatus:{
            type:String,
            enum:["pending","paid","failed"],
            default:"pending",
        },
        orderStatus:{
            type:String,
            enum: ["processing","shipped","delivered","cancelled"],
            default:"processing",
        },
        total:{
            type:Number,
            required:true,
            min: 0,
        },
    },
    {timestamps:true}
)
const Order = mongoose.model("Order",orderSchema)
export default Order