import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import { v2 as cloudinary } from "cloudinary";
import {Cart} from "../models/cartModel.js";          
import {Order} from "../models/orderModel.js";        

// This for the register user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // here we have Protected our password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    verifyEmail(token, email); // here sending email here

    newUser.token = token;
    await newUser.save();
    console.log("User Saved Successfully:", newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// this is for email verify withen 10 minitus.
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "The verification token has expired.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token verification failed.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Optional: Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified...!",
      });
    }

    user.token = null; // Clear verification token
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email Verified Successfully..!",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// this is for email reVerify email, it will be send email again.
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found..!",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email); // sending email here
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email sent again successfully..!",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this is for the login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required..!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Not Found..!",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials..!",
      });
    }

    if (existingUser.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Verify your account then login..!",
      });
    }

    // genarte token
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refeshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    existingUser.isLoggedIn = true;
    await existingUser.save();

    // check for the exisiting secsstion for the deleted..!
    const exisitingSesstion = await Session.findOne({
      userId: existingUser._id,
    });
    if (exisitingSesstion) {
      await Session.deleteOne({ userId: existingUser._id });   // ← FIXED
    }

    // create new sesstion
    await Session.create({ userId: existingUser._id });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refeshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this for the logout
export const logout = async (req, res) => {
  try {
    const userId = req.id; // Make sure this comes from isAuthenticated middleware

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Delete all sessions for this user
    await Session.deleteMany({ userId: userId });

    // Update user status
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// this is for the reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash the password (important!)
    // Assuming you already use bcrypt somewhere
    const bcrypt = require("bcryptjs"); // or import bcrypt from "bcryptjs"
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this is forgetPassword
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found..!",
      });
    }
    //  it will ganrete otp of 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP send To Email Successfully..!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required..!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not Found..!",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP is not generated or already verified..!",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one..!",
      });
    }

    // Compare OTP correctly
    if (otp !== user.otp) {                    // ← Improved comparison (string)
      return res.status(400).json({
        success: false,
        message: "OTP is invalid",
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP Verified Successfully..!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this is for the change Password
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if fields are provided
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//  All users get for the admine dashbord
export const allUser = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User get by using id
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token"   // ← FIXED: -opt → -otp
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found..!",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this is for profile
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    const { firstName, lastName, phoneNo, address, city, zipCode, role } = req.body;

    // Authorization check
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile..!",
      });
    }

    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found..!",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // Handle file upload
    if (req.file) {
      // Delete old image if exists
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    // Update fields safely
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNo = phoneNo || user.phoneNo;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    
    // Only allow role update if admin (optional security)
    if (loggedInUser.role === "admin" && role) {
      user.role = role;
    }

    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully..!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// this is delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user;

    // Only admin can delete
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete users..!",
      });
    }

    // Prevent self-delete
    if (loggedInUser._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account..!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found..!",
      });
    }

    // Delete profile picture from Cloudinary
    if (user.profilePicPublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicPublicId);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }

    // Delete related data
    // Cart uses field → userId
    // Order uses field → user
    await Cart.deleteMany({ userId: userId });
    await Order.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully..!",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


