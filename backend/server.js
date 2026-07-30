import dns from 'node:dns';
// Force DNS servers - Put this at the VERY TOP
// dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setServers(['1.1.1.1', '1.0.0.1']); // Cloudflare alternative

import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import productRout from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import orderRoute from "./routes/orderRoute.js"
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin:'https://free-mern-ecommerce-website-frontend.onrender.com',
    credentials:true
}))

app.use('/api/v1/user',userRoute);
app.use('/api/v1/product',productRout);
app.use('/api/v1/cart',cartRoute);
app.use('/api/v1/orders',orderRoute);

// Connect to Database FIRST, then start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to database. Server not started.", error);
        process.exit(1);
    }
};

startServer();