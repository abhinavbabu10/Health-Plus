import { UserPlus, Search, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      icon: <UserPlus className="w-12 h-12 text-blue-600" />,
      title: "Create Your Profile",
      description:
        "Sign up with your email and basic health information. Takes less than 2 minutes.",
      route: "/register",
    },
    {
      id: 2,
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: "Browse & Book",
      description:
        "Search doctors by specialty, location, and availability. Book instantly.",
      route: "/doctors",
    },
    {
      id: 3,
      icon: <Stethoscope className="w-12 h-12 text-blue-600" />,
      title: "Consult & Get Care",
      description:
        "Meet your doctor online or in-person. Receive prescriptions and follow-up care.",
      route: "/consult",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
      <p className="text-gray-600 mb-12">
        Get started in three simple steps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(step.route)}
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
