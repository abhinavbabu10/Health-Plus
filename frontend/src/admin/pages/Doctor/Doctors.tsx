import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../AdminLayout";
import { adminDoctorApi, Doctor } from "../../../admin/features/Doctor/doctorApi";
import RejectModal from "../../pages/components/RejectModal";

const Doctors: React.FC = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [rejectModal, setRejectModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [reason, setReason] = useState("");

  const [search, setSearch] = useState(""); 

  type DoctorStatus = "all" | "pending" | "verified" | "rejected";
  const [statusFilter, setStatusFilter] = useState<DoctorStatus>("all");

  // ---------------------------
  // Fetch Doctors
  // ---------------------------
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await adminDoctorApi.getDoctors(status);
      
      setDoctors(res.doctors);
      setFilteredDoctors(res.doctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [statusFilter]);

  // ---------------------------
  // Search Filtering
  // ---------------------------
  useEffect(() => {
    if (!search) {
      setFilteredDoctors(doctors);
      return;
    }

    const s = search.toLowerCase();
    const filtered = doctors.filter(
      (d) =>
        d.fullName.toLowerCase().includes(s) ||
        d.email.toLowerCase().includes(s) ||
        d.profile?.specialization?.toLowerCase().includes(s)
    );

    setFilteredDoctors(filtered);
  }, [search, doctors]);

  // ---------------------------
  // Approve Doctor
  // ---------------------------
  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this doctor?")) return;
    
    try {
      await adminDoctorApi.approveDoctor(id);
      alert("Doctor approved successfully!");
      fetchDoctors();
    } catch (err) {
      console.error("Error approving doctor:", err);
      alert("Failed to approve doctor");
    }
  };

  // ---------------------------
  // Reject Doctor
  // ---------------------------
  const handleReject = async () => {
    if (!selectedDoctor) return;
    
    if (!reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await adminDoctorApi.rejectDoctor(selectedDoctor.id, reason);
      alert("Doctor rejected successfully!");
      setRejectModal(false);
      setReason("");
      fetchDoctors();
    } catch (err) {
      console.error("Error rejecting doctor:", err);
      alert("Failed to reject doctor");
    }
  };

  return (
    <AdminLayout title="Doctors Management">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Doctors List</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name, email, specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DoctorStatus)}
          className="border rounded px-3 py-2 w-48"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Specialization</th>
                <th className="p-3 border">Experience</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{doc.fullName}</td>
                    <td className="p-3 border">{doc.email}</td>
                    <td className="p-3 border">
                      {doc.profile?.specialization || "—"}
                    </td>
                    <td className="p-3 border">
                      {doc.profile?.experience ? `${doc.profile.experience} years` : "—"}
                    </td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          doc.verificationStatus === "verified"
                            ? "bg-green-600"
                            : doc.verificationStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </td>

                    <td className="p-3 border">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/admin/doctors/${doc.id}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View
                        </button>

                        {doc.verificationStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(doc.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => {
                                setRejectModal(true);
                                setSelectedDoctor(doc);
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>

                      {doc.verificationStatus === "rejected" && doc.rejectionReason && (
                        <p className="text-sm text-red-500 mt-1">
                          Reason: {doc.rejectionReason}
                        </p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 p-4">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {rejectModal && selectedDoctor && (
        <RejectModal
          reason={reason}
          setReason={setReason}
          onClose={() => {
            setRejectModal(false);
            setReason("");
          }}
          onReject={handleReject}
        />
      )}
    </AdminLayout>
  );
};

export default Doctors;