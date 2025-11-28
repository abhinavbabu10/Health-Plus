import React from "react";
import heroImg from "../../assets/bg-login.jpg.jpg"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

 
  const { user } = useSelector((state: RootState) => state.auth);
  const { adminUser } = useSelector((state: RootState) => state.adminAuth);
  const { doctor } = useSelector((state: RootState) => state.doctorAuth);

 
  const isUserLoggedIn = !!user && user.role === "patient";
  const isAdminLoggedIn = !!adminUser && adminUser.role === "admin";
  const isDoctorLoggedIn = !!doctor && doctor.role === "doctor";

  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 px-8 md:px-20 py-16">
     
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Empowering Smarter Healthcare for{" "}
          <span className="text-blue-600">Patients & Professionals</span>
        </h1>

        <p className="text-gray-600 text-lg max-w-xl mx-auto md:mx-0">
          Experience seamless appointment scheduling, instant record access,
          and secure communication all from one powerful platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          {isUserLoggedIn ? (
        
            <button
              onClick={() => navigate("/appointments")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition"
            >
              Make Appointment
            </button>
          ) : isAdminLoggedIn ? (
         
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
            >
              Go to Admin Dashboard
            </button>
          ) : isDoctorLoggedIn ? (
       
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-green-700 transition"
            >
              Go to Doctor Dashboard
            </button>
          ) : (
        
            <>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/login")}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>


      <div className="flex-1 mt-10 md:mt-0 flex justify-center">
        <img
          src={heroImg}
          alt="Doctor illustration"
          className="w-full max-w-md md:max-w-lg drop-shadow-lg rounded-xl"
        />
      </div>
    </section>
  );
};

export default HeroSection;
