import React from "react";
import heroImg from "../../assets/bg-login.jpg.jpg";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  isLoggedIn?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoggedIn = false }) => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 px-8 md:px-20 py-16">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Empowering Smarter Healthcare for{" "}
          <span className="text-blue-600">Patients & Professionals</span>
        </h1>

        <p className="text-gray-600 text-lg max-w-xl mx-auto md:mx-0">
          Experience seamless appointment scheduling, instant record access, and
          secure communication all from one powerful platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/appointments")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
            >
              Make Appointment
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
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
          alt="Doctor with digital healthcare platform"
          className="w-full max-w-md md:max-w-lg drop-shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
