


import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";   // fixed name
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";

const router = express.Router();

// Add product
router.post('/add', isAuthenticated, isAdmin, multipleUpload, addProduct);

// Get all products
router.get('/getallproducts', getAllProduct);   // fixed small typo in route name (optional)

// delete product
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteProduct);

// update product
router.put('/update/:id', isAuthenticated, isAdmin, multipleUpload, updateProduct);




export default router;