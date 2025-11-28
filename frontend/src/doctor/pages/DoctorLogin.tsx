import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { doctorLogin, selectDoctorAuth, setDoctorError } from "../features/doctorAuthSlice";
import { Eye, EyeOff, Stethoscope } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
}

const DoctorLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { doctorToken, loading, error } = useAppSelector(selectDoctorAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (doctorToken) {
      navigate("/doctor/dashboard");
    }
  }, [doctorToken, navigate]);

  const validateField = (name: string, value: string) => {
    let err = "";

    if (name === "email") {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        err = "Enter a valid email address.";
      }
    }

    if (name === "password") {
      if (value.trim().length < 6) err = "Password must be at least 6 characters.";
    }

    return err;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (error) dispatch(setDoctorError(null));

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    if (touched[name]) {
      const newErr = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: newErr }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErr = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: newErr }));
  };

useEffect(() => {
  console.log("Doctor token changed:", doctorToken);
  if (doctorToken) {
    console.log("Navigating to /doctor/dashboard");
    navigate("/doctor/dashboard");
  }
}, [doctorToken, navigate]);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const emailErr = validateField("email", email);
  const passErr = validateField("password", password);

  setFormErrors({ email: emailErr, password: passErr });

  if (!emailErr && !passErr) {
    console.log("Dispatching doctorLogin with:", { email, password });
    dispatch(doctorLogin({ email, password }));
  } else {
    console.log("Validation errors:", { emailErr, passErr });
  }
};

  const inputClass = (name: string) => {
    const base =
      "w-full border rounded-lg p-2.5 text-sm shadow-md bg-white/90 backdrop-blur-sm transition";

    if (formErrors[name as keyof FormErrors])
      return `${base} border-red-400 focus:ring-1 focus:ring-red-300`;

    if (touched[name] && !formErrors[name as keyof FormErrors])
      return `${base} border-green-400 focus:ring-1 focus:ring-green-300`;

    return `${base} border-gray-300 focus:ring-1 focus:ring-blue-400`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{ backgroundImage: "url('/assets/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-700/70 to-teal-800/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Doctor Login</h2>
          <p className="text-gray-600 text-xs">Access your doctor dashboard</p>
        </div>

        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="email"
              type="email"
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

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${inputClass("password")} pr-10`}
              required
            />

            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-medium shadow-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/doctor/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Register as Doctor
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {opacity:0; transform:translateY(20px);}
          to {opacity:1; transform:translateY(0);}
        }
        .animate-fadeIn { animation: fadeIn .6s ease-out; }
      `}</style>
    </div>
  );
};

export default DoctorLogin;