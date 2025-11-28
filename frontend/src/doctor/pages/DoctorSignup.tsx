import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doctorSignupApi } from "../api/doctorApi"
import { User } from "lucide-react";
import { AxiosError } from "axios";


interface FormErrors { fullName?: string; email?: string; password?: string; }

const DoctorSignup: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (field?: string) => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!/^[\w\s]{2,}$/.test(form.fullName)) newErrors.fullName = "Enter valid name";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(form.email)) newErrors.email = "Enter a valid email";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 chars";

    if (field) {
      setErrors(prev => ({ ...prev, [field]: newErrors[field as keyof FormErrors] }));
      return !newErrors[field as keyof FormErrors];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validate(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await doctorSignupApi({ fullName: form.fullName, email: form.email, password: form.password });
      navigate('/doctor/login');
    } catch (err: unknown) {
    let msg = "Signup failed";

    if (err instanceof AxiosError) {
      msg = err.response?.data?.message || err.response?.data?.error || msg;
    } else if (err instanceof Error) {
      msg = err.message;
    }

    console.error(err);
    setServerError(msg);
  } finally {
    setLoading(false);
  }

  };

  const getInputClass = (field: keyof FormErrors) =>
    `w-full border rounded-lg p-2 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="text-white w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold">Doctor Signup</h2>
          <p className="text-gray-500 text-sm mt-1">Create your doctor account</p>
        </div>

        {serverError && <div className="text-red-600 mb-3">{serverError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className={getInputClass('fullName')} />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} className={getInputClass('email')} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={handleChange} className={getInputClass('password')} />
              <span className="absolute right-3 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-blue-600 text-white">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/doctor/login" className="text-blue-600">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignup;
