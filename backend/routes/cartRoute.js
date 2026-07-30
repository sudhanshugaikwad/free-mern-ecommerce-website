import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controllers/cartControllers.js";

const router = express.Router();

// Add product
router.get('/', isAuthenticated, getCart);

// Get all products
router.post('/add',isAuthenticated, addToCart);   // fixed small typo in route name (optional)

// delete product
router.put('/update', isAuthenticated, updateQuantity);

// update product
router.delete('/remove/:productId', isAuthenticated, removeFromCart);





export default router;