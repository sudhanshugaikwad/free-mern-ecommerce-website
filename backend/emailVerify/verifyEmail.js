import nodemailer from "nodemailer";
import "dotenv/config";

const createTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,   
    },
  });
};

export const verifyEmail = async (token, email) => {
  try {
    const transport = createTransport();

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify Your Email Address - eKart Platform",
      text: `Hi,

Thank you for signing up on eKart!

Please verify your email by clicking the link below:

http://localhost:5173/verify/${token}

This link will expire in 1 hour.

If you didn't create an account, please ignore this email.

Thanks,
eKart Team`,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; // so the controller can catch it
  }
};

export const sendOTPMail = async (otp, email) => {
  try {
    const transport = createTransport();

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP - eKart",
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("OTP email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};