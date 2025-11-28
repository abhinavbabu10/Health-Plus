import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const HomeLoggedIn = () => {
  return (
    <>
      <Navbar />
      <div className="mt-20">
        <HeroSection />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
};

export default HomeLoggedIn;
