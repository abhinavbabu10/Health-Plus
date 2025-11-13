import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { logout as userLogout } from "../../features/auth/authSlice";
import { adminLogout } from "../../admin/features/adminAuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const admin = useSelector((state: RootState) => state.adminAuth.adminUser);

  const isLoggedIn = !!user || !!admin;

  const handleLogout = () => {
    if (admin) {
      dispatch(adminLogout());
      navigate("/admin/login");
    } else {
      dispatch(userLogout());
      navigate("/");
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          HealthPlus
        </Link>

        <div className="hidden md:flex space-x-8 text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/doctors" className="hover:text-blue-600">Doctors</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        </div>

        <div className="space-x-4 flex items-center">
          {isLoggedIn ? (
            <>
              {admin ? (
                <span className="font-medium text-blue-700">👋 Welcome, Admin</span>
              ) : (
                <span className="font-medium text-blue-700">
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
