import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    console.log("MAIL_USER:", process.env.MAIL_USER);     // ← Add these 2 lines
    console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password reset OTP from eKart..!",
      html: `<p>Your OTP for Password reset is: <b>${otp}</b></p>`,
    };

    // Properly await the email sending
    const info = await transport.sendMail(mailOptions);

    console.log("OTP has been sent successfully..!", info.messageId);
    return info;
  } catch (error) {
   
  console.log("Full error:", error);
  console.log("Error response:", error.response?.data);
  toast.error(error.response?.data?.message || "Failed to send OTP");

    console.error("Error while sending OTP:", error.message);
    throw new Error("Failed to send OTP. Please try again later.");
  }
};