// src/doctor/pages/DoctorSignup.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doctorSignupApi } from "../api/doctorApi";
import { User} from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  specialization?: string;
  experience?: string;
  fees?: string;
  availableDays?: string;
}

const DoctorSignup: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    fees: "",
    availableDays: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.specialization.trim())
      newErrors.specialization = "Specialization is required";
    if (!form.experience || Number(form.experience) <= 0)
      newErrors.experience = "Experience must be a positive number";
    if (!form.fees || Number(form.fees) <= 0)
      newErrors.fees = "Consultation fee must be positive";
    if (!form.availableDays.trim())
      newErrors.availableDays = "Enter available days (e.g., Mon, Tue, Wed)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await doctorSignupApi({
        name: form.name,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        experience: Number(form.experience),
        fees: Number(form.fees),
        availableDays: form.availableDays.split(",").map((d) => d.trim()),
      });

      navigate("/doctor/login");
    } catch {
  (new Error("Doctor login failed"));
}
 finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border rounded-lg p-2 bg-white/80 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{ backgroundImage: "url('/assets/login-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-cyan-800/60 to-teal-900/70"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-2xl p-8 rounded-2xl border border-white/20 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg">
            <User className="text-white w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Doctor Signup</h2>
          <p className="text-gray-500 text-sm mt-1">Create your doctor account</p>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <input
              name="specialization"
              placeholder="Specialization (e.g., Cardiologist)"
              value={form.specialization}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.specialization && (
              <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <input
              name="experience"
              type="number"
              placeholder="Experience (Years)"
              value={form.experience}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
            )}
          </div>

          {/* Fees */}
          <div>
            <input
              name="fees"
              type="number"
              placeholder="Consultation Fee"
              value={form.fees}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.fees && (
              <p className="text-red-500 text-xs mt-1">{errors.fees}</p>
            )}
          </div>

          {/* Available Days */}
          <div>
            <input
              name="availableDays"
              placeholder="Available Days (Mon, Tue, Wed...)"
              value={form.availableDays}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.availableDays && (
              <p className="text-red-500 text-xs mt-1">{errors.availableDays}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-teal-600 shadow-lg hover:opacity-90 transition font-medium"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/doctor/login" className="text-blue-600 font-semibold hover:underline">
            Login Here
          </Link>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default DoctorSignup;
