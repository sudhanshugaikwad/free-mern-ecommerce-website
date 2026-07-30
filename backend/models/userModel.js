import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, default: "" }, // here image url from clodunary.com
    profilePicPublicId: { type: String, default: "" }, // For deletion from Cloudinary
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false }, // Fixed typo
    isLoggedIn: { type: Boolean, default: false }, // Fixed typo
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    phoneNo: { type: String, trim: true },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
