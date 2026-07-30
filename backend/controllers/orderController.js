import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { log } from "console";


export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body; // ← fixed

    const options = {
      amount: Math.round(Number(amount) * 100), // convert in to paise
      currency: currency || "INR",
      receipt: `receipt${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // save order in DB
    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();
    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.error("Error in Create Order: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;
    const userId = req.user._id;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" }          // ← changed
      );
      return res
        .status(400)
        .json({ success: false, message: "Payment Failed", order });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { returnDocument: "after" }          // ← changed
      );

      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], tatalPrice: 0 } }   // note: you have typo "tatalPrice"
      );

      return res.json({
        success: true,
        message: "Payment Successfully..!",
        order,
      });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { returnDocument: "after" }          // ← changed
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid Signature..!" });
    }
  } catch (error) {
    console.error("Error in verify Payment: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyOrder = async (req, res) => {
  try {
    const userId = req.user._id; // ← fixed

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error featching user orders: ", error);
    res.status(500).json({ message: error.message });
  }
};

// this is admin only
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; // user id will come from URL

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email"); // fetch userinfo

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error Feaching user order: ", error);
    res.status(500).json({ message: error.message });
  }
};

// get all orders
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email") // fixed: was "name email"
      .populate("products.productId", "productName productPrice productImg"); // added productImg

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Failled to feach all orders: ", error);
    res.status(500).json({ error: error.message });
  }
};

// get sales Data
export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ status: "Paid" });

    // total sales amount
    const totalSaleAgg = await Order.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSaleAgg[0]?.total || 0;

    // Sales group by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      {
        $match: {
          status: "Paid",
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));

    res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: formattedSales,
    });
  } catch (error) {
    console.error("Error feaching Sales Data..!", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log("Failed to delete order: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
