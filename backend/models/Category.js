import mongoose, { model } from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        slug:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        parentId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
    },
    {timestamps:true}
)
const Category = mongoose.model("Category",categorySchema)
export default Category