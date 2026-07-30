import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";



export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({ success: true, cart: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// this is for add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found..!",
      });
    }

    // find the user's cart (if exists)
    let cart = await Cart.findOne({ userId });

    // Create new cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ 
          productId, 
          quantity: 1, 
          price: product.productPrice 
        }],
        totalPrice: product.productPrice
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += 1;
      } else {
        // Add new product
        cart.items.push({ 
          productId,
          quantity: 1,
          price: product.productPrice, 
        });
      }

      // recalculate total price
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + (item.price * item.quantity), 
        0   // Important: initial value
      );
    }

    // save updated cart
    await cart.save();

    // populate before sending response
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully..!",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update quantity in cart
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found..!",
      });
    }
    const item =cart.items.find(item=>item.productId.toString() === productId)

    if (!item) {
      return res.status(400).json({
        success: false,
        message: "item not found..!",
      });
    }
    if (type === "increase") item.quantity += 1;
    if (type === "decrease" && item.quantity > 1) item.quantity -= 1;
    cart.totalPrice = cart.items.reduce((acc,item)=> acc + item.price * item.quantity,0)
    await cart.save();
    cart = await cart.populate("items.productId");
    res.status(200).json({success: true, cart});
     
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;   // ← Change to req.params

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found..!",
      });
    }

    // Remove item
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    // Recalculate total
    cart.totalPrice = cart.items.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    // This is vary importat populate()
    cart = await cart.populate("items.productId");
    
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
      message: "Product removed from cart successfully..!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

