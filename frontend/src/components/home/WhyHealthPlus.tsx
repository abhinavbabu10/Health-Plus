import React from "react";
import { ShieldCheck, CalendarCheck, CreditCard, FileText, Video, FolderHeart } from "lucide-react";

const WhyHealthPlus: React.FC = () => {
  const features = [
    {
      title: "Quick Booking",
      desc: "Book appointments instantly with a few clicks — no long queues or waiting calls.",
      icon: <CalendarCheck className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Verified Doctors",
      desc: "All our doctors are verified professionals ensuring safe and reliable medical advice.",
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
    },
    {
      title: "Secure Payments",
      desc: "Make hassle-free and encrypted online payments with multiple trusted gateways.",
      icon: <CreditCard className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "e-Prescriptions",
      desc: "Receive digital prescriptions instantly after your consultation — fast and paperless.",
      icon: <FileText className="w-8 h-8 text-teal-600" />,
    },
    {
      title: "Online Consultations",
      desc: "Connect with doctors anytime, anywhere — through secure video calls or chat.",
      icon: <Video className="w-8 h-8 text-blue-500" />,
    },
    {
      title: "Medical Records",
      desc: "All your medical history stored securely in one place for easy access and sharing.",
      icon: <FolderHeart className="w-8 h-8 text-rose-500" />,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Why <span className="text-blue-600">Health Plus?</span>
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          At Health Plus, we’re committed to providing you with an easy, secure, and efficient healthcare experience. 
          From booking to consultation, every step is designed for your comfort and convenience.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyHealthPlus;
