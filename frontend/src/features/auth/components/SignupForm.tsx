import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import bgImg from "../../../assets/signup.png.jpg"
import { AppDispatch } from "../../../app/store";
import { signupUser, verifyOtp } from "../authSlice";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Calendar, MapPin, Eye, EyeOff } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dob: string;
  address: string;
  role: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const SignupForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    address: "",
    role: "patient",
  });

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, step]);

  const handleResendOtp = async () => {
    setTimer(60);
    setCanResend(false);
    await dispatch(signupUser(formData));
  };

  const validateField = (name: keyof FormData, value: string): string => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!/^[A-Z][a-zA-Z\s]*$/.test(value))
          error = "Name must start with a capital letter.";
        break;
      case "email":
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          error = "Enter a valid email.";
        break;
      case "phone":
        if (!/^\d{10}$/.test(value))
          error = "Phone number must be 10 digits.";
        break;
      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          )
        )
          error =
            "Password must include uppercase, lowercase, number & special char.";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match.";
        break;
      case "address":
        if (!/^[a-zA-Z0-9\s,.-]+[0-9]{6}$/.test(value))
          error = "Include a 6-digit pincode at the end.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const newErrors: FormErrors = {};

  (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) newErrors[key] = error;
  });

  setErrors(newErrors);

 
  if (Object.keys(newErrors).length > 0) return;


  if (formData.role === "admin") {
    alert("⚠️ Admin accounts cannot be created through user signup.");
    return;
  }

  const resultAction = await dispatch(signupUser(formData));

  if (signupUser.fulfilled.match(resultAction)) {
    alert("✅ OTP sent to your email!");
    setStep("otp");
    setTimer(60);
    setCanResend(false);
  } else {
    alert("❌ Signup failed. Try again.");
  }
};


  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(verifyOtp({ email: formData.email, otp }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      alert("✅ OTP Verified! You can now log in.");
      navigate("/login");
    } else {
      alert("❌ Invalid OTP, please try again.");
    }
  };

  const inputClass = (name: keyof FormData): string => {
    const base =
      "w-full border rounded-lg p-2 pl-9 text-xs transition-all duration-300 bg-white/90 backdrop-blur-sm";
    if (errors[name]) return `${base} border-red-400 focus:ring-1 focus:ring-red-300 focus:border-red-400`;
    if (touched[name] && !errors[name])
      return `${base} border-green-400 focus:ring-1 focus:ring-green-300 focus:border-green-400`;
    return `${base} border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400`;
  };

  const handleGoogleSignup = (): void => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen px-4 py-6 overflow-hidden"
      style={{
        backgroundImage:bgImg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-800/60 to-teal-900/70 backdrop-blur-sm"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-2xl bg-white/95 shadow-2xl rounded-2xl p-6 backdrop-blur-xl border border-white/20 animate-fadeIn my-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-2 shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {step === "form" ? "Join HealthPlus" : "Verify Your Email"}
          </h2>
          <p className="text-gray-600 text-xs mt-1">
            {step === "form" ? "Create your account to get started" : "We sent a code to your email"}
          </p>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("fullName")}
                  required
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.fullName}</p>}
              </div>

              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("email")}
                  required
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("phone")}
                  required
                />
                {errors.phone && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.phone}</p>}
              </div>

              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClass("gender")} pl-2`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                {errors.password && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.password}</p>}
              </div>

              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("confirmPassword")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("dob")}
                  required
                />
              </div>

              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`${inputClass("role")} pl-2`}
                  required
                >
                  <option value="patient">Patient</option>
              
                </select>
              </div>
            </div>

          
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <textarea
                name="address"
                placeholder="Full Address with 6-digit Pincode"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${inputClass("address")} resize-none`}
                rows={2}
                required
              />
              {errors.address && <p className="text-red-500 text-[10px] mt-0.5 ml-1">{errors.address}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-cyan-700 text-sm font-semibold mt-3 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Send OTP
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-2 border-2 border-gray-300 py-2 px-3 rounded-lg w-full hover:bg-gray-50 text-xs font-medium text-gray-700 transition-all duration-300 hover:border-gray-400 hover:shadow-md"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-4 h-4"
              />
              Sign up with Google
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
            <div className="bg-blue-50 rounded-xl p-5 mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-2">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-700 text-xs mb-1">
                We sent a verification code to
              </p>
              <p className="font-semibold text-gray-900 text-sm">{formData.email}</p>
            </div>

            <input
              type="text"
              name="otp"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-center tracking-[0.5em] text-xl font-bold bg-white/80 backdrop-blur-sm transition-all duration-300"
              required
              maxLength={6}
            />

            <div className="flex justify-center items-center gap-2 text-xs">
              <span className="text-gray-600">Didn't receive code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`font-semibold ${
                  canResend
                    ? "text-blue-600 hover:text-blue-700 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend" : `Resend in ${timer}s`}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-semibold mt-3 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Verify & Continue
            </button>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

export default SignupForm;