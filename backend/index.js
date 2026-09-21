import dotenv from "dotenv/config"
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import dns from "dns";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import reviewRoutes from "./routes/reviewsRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import { handleStripeWebhook } from "./controllers/paymentController.js";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// dotenv.config()
connectDB();

const app = express()

app.use(cors());

app.post(
    "/api/payments/webhook",
    express.raw({type:"application/json"}),
    handleStripeWebhook
)

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("API is running...")
})
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/reviews",reviewRoutes)
app.use("/api/payments",paymentRoutes)


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})
