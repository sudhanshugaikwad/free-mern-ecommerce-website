import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Forgot Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================== LOGIN ====================
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ==================== FORGOT PASSWORD - STEP 1: SEND OTP ====================
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/forgot-password`,
        { email: forgotEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setForgotStep(2);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==================== FORGOT PASSWORD - STEP 2: VERIFY OTP ====================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/verify-otp/${forgotEmail}`,
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setForgotStep(3); // Move to new password step
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ==================== FORGOT PASSWORD - STEP 3: RESET PASSWORD ====================
  // ⚠️ You still need to create this backend endpoint
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // TODO: Create this endpoint on backend
      // POST /api/v1/user/reset-password
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/reset-password`,
        {
          email: forgotEmail,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully!");
        // Reset everything and go back to login
        setIsForgotPassword(false);
        setForgotStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const goBackToLogin = () => {
    setIsForgotPassword(false);
    setForgotStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ==================== RENDER ====================
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {isForgotPassword ? "Reset Password" : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {isForgotPassword
              ? forgotStep === 1
                ? "Enter your email to receive an OTP"
                : forgotStep === 2
                ? "Enter the OTP sent to your email"
                : "Create a new password"
              : "Enter your credentials to login"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ==================== LOGIN FORM ==================== */}
          {!isForgotPassword && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="sudhanshu@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-gray-600 hover:text-black hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter a Password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(false)}
                      className="w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(true)}
                      className="w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD - STEP 1: EMAIL ==================== */}
          {isForgotPassword && forgotStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="forgotEmail">Email</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD - STEP 2: OTP ==================== */}
          {isForgotPassword && forgotStep === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                OTP sent to <span className="font-medium">{forgotEmail}</span>
              </p>
              <div className="grid gap-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD - STEP 3: NEW PASSWORD ==================== */}
          {isForgotPassword && forgotStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {showNewPassword ? (
                    <Eye
                      onClick={() => setShowNewPassword(false)}
                      className="w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowNewPassword(true)}
                      className="w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {/* Login Button */}
          {!isForgotPassword && (
            <>
              <Button
                onClick={submitHandler}
                type="submit"
                className="w-full cursor-pointer bg-black"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Please wait..!
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <p className="text-gray-700 text-sm">
                Don't have an account?{" "}
                <Link
                  to={"/signup"}
                  className="hover:underline cursor-pointer text-gray-950"
                >
                  Signup
                </Link>
              </p>
            </>
          )}

          {/* Forgot Password Buttons */}
          {isForgotPassword && (
            <>
              {forgotStep === 1 && (
                <Button
                  onClick={handleSendOTP}
                  className="w-full cursor-pointer bg-black"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              )}

              {forgotStep === 2 && (
                <Button
                  onClick={handleVerifyOTP}
                  className="w-full cursor-pointer bg-black"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              )}

              {forgotStep === 3 && (
                <Button
                  onClick={handleResetPassword}
                  className="w-full cursor-pointer bg-black"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={goBackToLogin}
                className="w-full text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;