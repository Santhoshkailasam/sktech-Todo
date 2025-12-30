import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">

      {/* Company Name */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-wide">
        PrimeTrade<span className="text-indigo-500">.ai</span>
      </h1>

      {/* Login Card */}
      <div className="w-full max-w-md bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg">

        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 text-center">
          Login
        </h2>

        {error && (
          <p className="mb-4 text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-3 rounded-md bg-gray-800 text-white
                     border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password with eye icon */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 pr-12 rounded-md bg-gray-800 text-white
                       border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Eye icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
          >
            {showPassword ? (
              /* Eye Off */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18M10.584 10.587A3 3 0 0012 15a3 3 0 002.414-4.413"
                />
              </svg>
            ) : (
              /* Eye */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600
                     text-white py-3 rounded-md transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-5">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
