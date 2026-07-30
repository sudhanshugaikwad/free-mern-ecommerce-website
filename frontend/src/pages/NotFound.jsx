export default function NotFound() {
  return (
    <div className="min-h-screen bg-lient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-gray-900 leading-none tracking-tighter select-none">
            404
          </h1>
          <div className="absolute -top-6 -right-6 text-6xl">😵‍💫</div>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          Oops! Page not found
        </h2>
        
        <p className="text-gray-600 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-gray-900 text-white font-medium rounded-2xl transition-all active:scale-95"
          >
            ← Back to Home
          </a>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-300 hover:bg-gray-100 font-medium rounded-2xl transition-all"
          >
            Go Back
          </button>
        </div>

        {/* Extra links */}
        <div className="mt-10 text-sm text-gray-500">
          Need help?{' '}
          <a href="/contact" className="text-black hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}