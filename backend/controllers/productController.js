import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// this is for add product in db

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id; // assuming you set req.id in isAuthenticated middleware

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required..!",
      });
    }

    // handle multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // create a product in db
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });

    return res.status(200).json({
      success: true,
      message: "Product added Successfully..!",
      product: newProduct, // changed key to lowercase for consistency
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this is for get products

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      products: products || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;   // ← Fixed: use id from route
        const userId = req.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found..!"
            });
        }

        // Optional: Check ownership
        // if (product.userId.toString() !== userId) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "You are not authorized to delete this product!"
        //     });
        // }

        // Delete images from Cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        // Delete product from database
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully..!"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { id: productId } = req.params;   // ← Fixed: use id from route
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body;
        const userId = req.id;

        // Check if product exists
        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found..!"
            });
        }

        // Check ownership
        // if (product.userId.toString() !== userId) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "You are not authorized to update this product!"
        //     });
        // }

        let updatedImages = [];

        // Handle existing images (which ones to keep)
        if (existingImages) {
            const keepIds = JSON.parse(existingImages); // array of public_ids to keep
            updatedImages = product.productImg.filter((img) => 
                keepIds.includes(img.public_id)
            );
        } else {
            updatedImages = [...product.productImg]; // keep all by default
        }

        // If new files are uploaded, add them
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_products"
                });

                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }

        // Delete removed images from Cloudinary
        const removeImages = product.productImg.filter(
            (img) => !updatedImages.some((newImg) => newImg.public_id === img.public_id)
        );

        for (let img of removeImages) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }

        // Update product fields
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully..!",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
