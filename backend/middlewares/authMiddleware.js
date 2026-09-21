import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async(req,res,next)=>{
    let token;

    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        try {
            token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-passwordHash");

            if(!req.user){
                return res.status(401).json({message:"User not found"})
            }
            next()
        } catch (error) {
            res.status(401).json({message:"Not authorized,token failed"})
        }
    }
    else{
            res.status(401).json({message:"Not authorized,no token"})
    }
}

export const adminOnly = async(req,res,next)=>{
    if(req.user && req.user.role == "admin"){
        next()
    }
    else{
        return res.status(403).json({message:"Access denied! Admin only"})
    }
}