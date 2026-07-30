import express from "express";
import {
  allUser,
  changePassword,
  deleteUser,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  resetPassword,
  reVerify,
  updateUser,
  verify,
  verifyOTP,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();
// This is for the user registration
router.post("/register", register);
// this is for the user email verification
router.post("/verify", verify);
// this is for the email Reverification
router.post("/reVerify", reVerify);
// this is for login
router.post("/login", login);
// this is for logout
router.post("/logout", isAuthenticated, logout);
// this is for reset OTP
router.post("/forgot-password", forgotPassword);
// this i sfro reset
router.post("/reset-password", resetPassword);
// this is for verify otp
router.post("/verify-otp/:email", verifyOTP);
// this is for change passcode
router.post("/change-password/:email", changePassword);
// all users get in dashbord api
router.get("/all-user", isAuthenticated, isAdmin, allUser);
// this for the get all user by using id
router.get("/get-user/:userId", getUserById);
// this is for profile update
router.put("/update/:id", isAuthenticated, singleUpload, updateUser);
// this is fro delete user
// userRoutes.js
router.delete("/delete-user/:userId", isAuthenticated, isAdmin, deleteUser);

export default router;
