import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
     
        <div>
          <h2 className="text-2xl font-bold mb-3">HealthPlus</h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Your trusted partner in digital healthcare — connecting patients, doctors,
            and technology for better health and convenience.
          </p>
        </div>

    
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-blue-100">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            <li><Link to="/doctors" className="hover:text-white transition">Doctors</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

    
        <div>
          <h3 className="font-semibold text-lg mb-3">Services</h3>
          <ul className="space-y-2 text-blue-100">
            <li>Online Consultation</li>
            <li>Prescription Management</li>
            <li>Appointment Booking</li>
            <li>Medical Records</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" aria-label="Facebook" className="hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-blue-100">
            📧 support@healthplus.com <br />
            📞 +91 9645801852
          </p>
        </div>
      </div>


      <div className="border-t border-blue-500 mt-10 pt-4 text-center text-sm text-blue-100">
        © {new Date().getFullYear()} HealthPlus. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
