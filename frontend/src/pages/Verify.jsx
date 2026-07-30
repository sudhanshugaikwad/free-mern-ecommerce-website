import React from "react";
import { MailCheck } from "lucide-react";

function Verify() {
  return (
    <div className="min-h-screen flex items-center justify-center from-slate-50 via-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center">

        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <MailCheck className="w-10 h-10 text-green-600" />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-bold text-slate-800">
          Check Verify Your Email
        </h1>

        {/* Description */}
        <p className="mt-4 text-slate-600 leading-7">
          We've sent a verification link to your email address.
          Please check your inbox and click the verification link to
          activate your account.
        </p>

       

        {/* Buttons */}
        {/* <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 py-3 rounded-xl bg-gray-950 text-white font-medium hover:bg-gray-900 transition-all duration-300"
          >
            Resend Email
          </button>

          <button
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-all duration-300"
          >
            Back to Login
          </button>
        </div> */}

        {/* Footer */}
        <p className="mt-8 text-sm text-slate-500">
          Thank you for joining us. We can't wait to have you onboard!
        </p>

      </div>
    </div>
  );
}

export default Verify;