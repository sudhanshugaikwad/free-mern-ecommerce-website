import dns from 'node:dns';
dns.setServers(['1.1.1.1', '1.0.0.1']);

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import productRout from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    "https://free-mern-ecommerce-website-frontend.onrender.com",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "eKart Backend is running successfully!",
    status: "OK"
  });
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRout);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

// Start Server
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