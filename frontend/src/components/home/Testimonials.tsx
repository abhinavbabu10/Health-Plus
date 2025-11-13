import { Star } from "lucide-react";

const testimonials = [
  {
    initials: "RK",
    name: "Rajesh Kumar",
    role: "Patient",
    feedback:
      "HealthPlus made it so easy to find a specialist. I booked an appointment within minutes and got my prescription digitally. Highly recommended!",
    rating: 5,
  },
  {
    initials: "PP",
    name: "Priya Patel",
    role: "Patient",
    feedback:
      "The online consultation feature is amazing. I didn't have to take time off work. The doctor was professional and the platform is very secure.",
    rating: 5,
  },
  {
    initials: "AS",
    name: "Amit Singh",
    role: "Patient",
    feedback:
      "Finally, a healthcare platform that respects my time and privacy. The e-prescriptions are convenient and my pharmacy accepts them instantly.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Trusted by Thousands
        </h2>
        <p className="text-gray-600 mb-12">
          Real patients, real stories, real results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300"
            >
           
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
                {t.initials}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">{t.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{t.role}</p>

             
              <p className="text-gray-600 italic mb-4">“{t.feedback}”</p>

           
              <div className="flex justify-center">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
