import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  adminLogin,
  selectAdminAuth,
  clearAdminError,
} from "../features/adminAuthSlice";
import { Eye, EyeOff, Shield } from "lucide-react";

const AdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { adminToken, loading, error } = useAppSelector(selectAdminAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

 
  useEffect(() => {
    if (adminToken) navigate("/admin/dashboard");
  }, [adminToken, navigate]);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setFormError("Email and password are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

   
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    const result = await dispatch(adminLogin({ email, password }));


    if (adminLogin.fulfilled.match(result)) {
      navigate("/admin/dashboard");
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (error) dispatch(clearAdminError());
      if (formError) setFormError("");
    };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{
        backgroundImage: "url('/assets/admin-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-indigo-900/70 to-blue-900/80 backdrop-blur-sm"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/95 shadow-2xl rounded-2xl p-8 backdrop-blur-xl border border-white/20 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full mb-2 shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Admin Portal
          </h2>
          <p className="text-gray-600 text-xs mt-1">
            Secure access for authorized personnel only
          </p>
        </div>

        {(error || formError) && (
          <p className="text-red-600 text-center text-sm mb-4">
            {error || formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange(setEmail)}
              placeholder="Admin Email"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white/90 backdrop-blur-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange(setPassword)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white/90 backdrop-blur-sm pr-10 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
            }`}
          >
            {loading ? "Signing in..." : "Sign in Securely"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Back to{" "}
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            Home
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
