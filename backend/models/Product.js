import mongoose, { model } from "mongoose";


const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true,
            min:0
        },
        stock:{
            type:Number,
            required:true,
            min:0,
            default:0
        },
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required:true
        },
        images:{
            type: [String],
            default: []
        },
    },
    {timestamps:true}
)
 const Product = mongoose.model("Product",productSchema)
 export default Product