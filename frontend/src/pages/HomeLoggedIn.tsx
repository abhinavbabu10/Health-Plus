import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const HomeLoggedIn = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <Navbar />
      <div className="mt-20">
        <HeroSection isLoggedIn={!!user} />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
};

export default HomeLoggedIn;
