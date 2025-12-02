import React, { useState, useEffect } from "react";
import { Bell, UserCircle, ChevronDown } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { selectDoctorAuth } from "../features/doctorAuthSlice";
import { useNavigate } from "react-router-dom";
import { fetchDoctorProfile } from "../features/doctorProfileSlice";
import { useAppDispatch } from "../../app/hooks";

const DoctorNavbar: React.FC = () => {
  const { doctor, doctorToken } = useAppSelector(selectDoctorAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // -------- Fetch profile photo ----------
  useEffect(() => {
    const loadProfile = async () => {
      if (!doctorToken) return;

      try {
        const profile = await dispatch(fetchDoctorProfile()).unwrap();
        if (profile?.documents?.profilePhoto) {
          setProfileImage(profile.documents.profilePhoto);
        }
      } catch (error) {
        console.error("Failed to load doctor profile", error);
      }
    };

    loadProfile();
  }, [doctorToken, dispatch]);

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4 relative">
      <h1 className="text-lg font-semibold text-gray-800">
        Hello, {doctor?.fullName?.split(" ")[0] ?? "Doctor"}
      </h1>

      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-blue-600 transition">
          <Bell size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            {/* Profile Image */}
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border"
              />
            ) : (
              <UserCircle size={32} className="text-gray-600" />
            )}

            <span className="text-gray-800 font-medium">
              {doctor?.fullName ?? "Doctor"}
            </span>
            <ChevronDown size={18} className="text-gray-600" />
          </div>

          {/* Dropdown Menu */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden border z-20">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/doctor/profile");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>

              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/doctor/dashboard");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DoctorNavbar;
