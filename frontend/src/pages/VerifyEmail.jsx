import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react'; // Add this import

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying your email...");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStatus("Email Verified Successfully!");
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Verification Failed. Please try again.");
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center w-[90%] max-w-md">
                
                {/* Icon Added Here */}
                <div className="flex justify-center mb-4">
                    {isSuccess ? (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    ) : status.includes("Verifying...") ? (
                        <Loader2 className="w-16 h-16 text-gray-900 animate-spin" />
                    ) : (
                        <XCircle className="w-16 h-16 text-red-500" />
                    )}
                </div>

                <h2 className={`text-xl font-semibold ${isSuccess ? 'text-green-600' : 'text-gray-800'}`}>
                    {status}
                </h2>

            </div>
        </div>
  );
}

export default VerifyEmail;