import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../AdminLayout";
import { adminDoctorApi } from "../../../admin/features/Doctor/doctorApi";
import RejectModal from "../../pages/components/RejectModal";


export interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialization?: string;
  experience?: string | number;
  documents?: {
    medicalLicense?: string;
    degreeCertificate?: string;
    idProof?: string;
  };
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

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
// ...

const fetchDoctors = async () => {
  setLoading(true);
  try {
    const res = await adminDoctorApi.getDoctors();
    console.log("API RESULT:", res.data);

    const list: Doctor[] = res.data?.doctors ?? [];
    setDoctors(list);
    setFilteredDoctors(list);
  } catch (err) {
    console.error(err);
    setDoctors([]);
    setFilteredDoctors([]);
  } finally {
    setLoading(false);
  }
};


  // Run once
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = [...doctors];
    if (statusFilter) filtered = filtered.filter(d => d.verificationStatus === statusFilter);

    const s = search.toLowerCase();
    if (search) {
      filtered = filtered.filter(
        d =>
          d.name.toLowerCase().includes(s) ||
          d.email.toLowerCase().includes(s) ||
          d.specialization?.toLowerCase().includes(s)
      );
    }

    setFilteredDoctors(filtered);
  }, [search, statusFilter, doctors]);

  // Approve
  const handleApprove = async (id: string) => {
    await adminDoctorApi.approveDoctor(id);
    fetchDoctors();
  };

  // Reject
  const handleReject = async () => {
    if (!selectedDoctor) return;
    await adminDoctorApi.rejectDoctor(selectedDoctor._id, reason);
    setRejectModal(false);
    setReason("");
    fetchDoctors();
  };

  return (
    <AdminLayout title="Doctors Management">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Doctors List</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />

 <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value as DoctorStatus)}
  className="border rounded px-3 py-2 w-48"
>
  <option value="all">All</option>
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
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{doc.name}</td>
                    <td className="p-3 border">{doc.email}</td>
                    <td className="p-3 border">{doc.specialization || "—"}</td>
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
                      <button
                        onClick={() => navigate(`/admin/doctors/${doc._id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                      >
                        View
                      </button>

                      {doc.verificationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(doc._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
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

                      {doc.verificationStatus === "rejected" && (
                        <p className="text-sm text-red-500">Reason: {doc.rejectionReason}</p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 p-4">
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
          onClose={() => setRejectModal(false)}
          onReject={handleReject}
        />
      )}
    </AdminLayout>
  );
};

export default Doctors;
