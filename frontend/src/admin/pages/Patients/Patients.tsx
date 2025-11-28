import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchPatients, blockUser, unblockUser } from "../../features/Patients/patientSlice";
import { Search, Lock, Unlock } from "lucide-react";
import { Patient } from "../../../types/PatientTypes";
import toast from "react-hot-toast";  

const Patients: React.FC = () => {
  const dispatch = useAppDispatch();
  const { patients, loading, filters } = useAppSelector((state) => state.patients);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    dispatch(fetchPatients({ token, filters }));
  }, [dispatch, filters]);

  const calculateAge = (dob?: string) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    return Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000));
  };

  const filteredPatients = patients.filter((p: Patient) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());

    const matchesGender = genderFilter ? p.gender === genderFilter : true;
    return matchesSearch && matchesGender;
  });

  const handleToggleBlock = async (id: string, isBlocked?: boolean) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      if (isBlocked) {
        await dispatch(unblockUser({ userId: id, token })).unwrap();
        toast.success("User unblocked");
      } else {
        await dispatch(blockUser({ userId: id, token })).unwrap();
        toast.success("User blocked");
      }

      dispatch(fetchPatients({ token, filters }));
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">

        <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
          Patients
        </h1>

        <div className="flex gap-4 mb-8">
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border"
            />
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white border"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.email}</td>
                    <td className="p-3 capitalize">{p.gender || "-"}</td>
                    <td className="p-3">{calculateAge(p.dob)}</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                        {p.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleToggleBlock(p._id, p.isBlocked)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-white ${
                          p.isBlocked ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {p.isBlocked ? <><Unlock size={16} /> Unblock</> : <><Lock size={16} /> Block</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default Patients;
