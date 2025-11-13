import React from "react";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import WhyHealthPlus from "../components/home/WhyHealthPlus"
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import Footer from "../components/layout/Footer";




const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <WhyHealthPlus />
        <HowItWorks />
        <Testimonials />
        <Footer />

      </div>
    </>
  );
};

export default Home;
