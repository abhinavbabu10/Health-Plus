import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, selectAuth, setError } from "../features/auth/authSlice";
import { Eye, EyeOff, User } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useAppSelector(selectAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        error = "Enter a valid email address.";
      }
    } else if (name === "password") {
      if (value.trim().length < 6) {
        error = "Password must be at least 6 characters.";
      }
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (error) dispatch(setError(null));
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    if (touched[name]) {
      const newError = validateField(name, value);
      setFormErrors({ ...formErrors, [name]: newError });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const newError = validateField(name, value);
    setFormErrors({ ...formErrors, [name]: newError });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);
    setFormErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      dispatch(login({ email, password }))
        .unwrap()
        .then((res) => {
          if (res.user.role === "admin") {
            dispatch(setError("Admins cannot log in from the user side."));
            return;
          }
          navigate("/home");
        })
        .catch(() => {});
    }
  };

  const inputClass = (name: string) => {
    const base =
      "w-full border rounded-lg p-2.5 text-sm transition-all duration-300 bg-white/90 backdrop-blur-sm";
    if (formErrors[name as keyof FormErrors])
      return `${base} border-red-400 focus:ring-1 focus:ring-red-300 focus:border-red-400`;
    if (touched[name] && !formErrors[name as keyof FormErrors])
      return `${base} border-green-400 focus:ring-1 focus:ring-green-300 focus:border-green-400`;
    return `${base} border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{
        backgroundImage: "url('/assets/login-bg.jpg')", // 👈 your image path
      }}
    >
      {/* Overlay for color blend & readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-800/60 to-teal-900/70 backdrop-blur-sm"></div>

      {/* Decorative glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 shadow-2xl rounded-2xl p-8 backdrop-blur-xl border border-white/20 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-2 shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome 
          </h2>
          <p className="text-gray-600 text-xs mt-1">
            Login to continue to HealthPlus
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("email")}
              required
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClass("password")} pr-10`}
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
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
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

export default Login;
