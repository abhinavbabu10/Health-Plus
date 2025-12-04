import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../AdminLayout";
import { adminDoctorApi, Doctor } from "../../../admin/features/Doctor/doctorApi";
import RejectModal from "../../pages/components/RejectModal";

const DoctorDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  const loadDoctor = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await adminDoctorApi.getDoctorById(id);
      setDoctor(res.doctor);
    } catch (err) {
      console.error("Error loading doctor:", err);
      alert("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  const approveDoctor = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to approve this doctor?")) return;

    try {
      await adminDoctorApi.approveDoctor(id);
      alert("Doctor approved successfully!");
      loadDoctor();
    } catch (err) {
      console.error("Error approving doctor:", err);
      alert("Failed to approve doctor");
    }
  };

  const rejectDoctor = async () => {
    if (!id || !reason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await adminDoctorApi.rejectDoctor(id, reason);
      alert("Doctor rejected successfully!");
      setRejectModal(false);
      setReason("");
      loadDoctor();
    } catch (err) {
      console.error("Error rejecting doctor:", err);
      alert("Failed to reject doctor");
    }
  };

  if (loading)
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading doctor details...</p>
        </div>
      </AdminLayout>
    );

  if (!doctor)
    return (
      <AdminLayout title="Doctor Not Found">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">No doctor found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout title={`Doctor: ${doctor.fullName}`}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{doctor.fullName}</h2>
            <p className="text-gray-600">{doctor.email}</p>

            {/* Status */}
            <span
              className={`inline-block mt-2 px-3 py-1 rounded text-white text-sm ${
                doctor.verificationStatus === "verified"
                  ? "bg-green-600"
                  : doctor.verificationStatus === "rejected"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
            >
              {doctor.verificationStatus}
            </span>
          </div>

          <button
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <hr className="my-4" />

        {/* Profile Information */}
        {doctor.profile ? (
          <>
            <section>
              <h3 className="text-lg font-semibold mb-3">Profile Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard label="Specialization" value={doctor.profile.specialization} />
                <InfoCard label="Experience" value={`${doctor.profile.experience} years`} />
                <InfoCard label="License Number" value={doctor.profile.licenseNumber} />
                
                {doctor.profile.qualifications && doctor.profile.qualifications.length > 0 && (
                  <div className="border p-3 rounded sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-2">Qualifications</p>
                    <ul className="list-disc list-inside">
                      {doctor.profile.qualifications.map((qual, idx) => (
                        <li key={idx} className="font-medium">{qual}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Clinic Information */}
            {doctor.profile.clinic && doctor.profile.clinic.name && (
              <>
                <hr className="my-5" />
                <section>
                  <h3 className="text-lg font-semibold mb-3">Clinic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard label="Clinic Name" value={doctor.profile.clinic.name} />
                    <InfoCard label="City" value={doctor.profile.clinic.city} />
                    <InfoCard 
                      label="Address" 
                      value={doctor.profile.clinic.address} 
                      span={2} 
                    />
                    <InfoCard label="State" value={doctor.profile.clinic.state} />
                    <InfoCard label="Pincode" value={doctor.profile.clinic.pincode} />
                  </div>
                </section>
              </>
            )}

            <hr className="my-5" />

            {/* Verification Documents */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Verification Documents</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DocumentCard
                  label="Profile Photo"
                  url={doctor.profile.documents.profilePhoto}
                />
                <DocumentCard
                  label="Medical License"
                  url={doctor.profile.documents.license}
                />
                <DocumentCard
                  label="Certificate"
                  url={doctor.profile.documents.certificate}
                />
                <DocumentCard
                  label="Government ID"
                  url={doctor.profile.documents.govtId}
                />
                <DocumentCard
                  label="Experience Certificate"
                  url={doctor.profile.documents.experienceCert}
                />
              </div>
            </section>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No profile information available for this doctor.</p>
          </div>
        )}

        {/* Rejection Reason */}
        {doctor.verificationStatus === "rejected" && doctor.rejectionReason && (
          <>
            <hr className="my-5" />
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h3>
              <p className="text-red-700">{doctor.rejectionReason}</p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          {doctor.verificationStatus === "pending" && (
            <>
              <button
                onClick={approveDoctor}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
              >
                ✓ Approve Doctor
              </button>

              <button
                onClick={() => setRejectModal(true)}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-medium"
              >
                ✗ Reject Doctor
              </button>
            </>
          )}

          {doctor.verificationStatus === "verified" && (
            <span className="text-green-600 font-medium">
              ✓ This doctor has been verified
            </span>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <RejectModal
          reason={reason}
          setReason={setReason}
          onClose={() => {
            setRejectModal(false);
            setReason("");
          }}
          onReject={rejectDoctor}
        />
      )}
    </AdminLayout>
  );
};

// ----------- Components --------------

const InfoCard: React.FC<{ label: string; value?: string; span?: number }> = ({
  label,
  value,
  span,
}) => (
  <div className={`border p-3 rounded ${span === 2 ? "sm:col-span-2" : ""}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

const DocumentCard: React.FC<{ label: string; url?: string }> = ({
  label,
  url,
}) => (
  <div className="border rounded p-3">
    <p className="text-xs text-gray-500 mb-2">{label}</p>

    {url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={label}
          className="w-full h-32 object-cover rounded border hover:opacity-80 cursor-pointer"
        />
      </a>
    ) : (
      <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded border">
        <p className="text-gray-400 text-sm">Not uploaded</p>
      </div>
    )}
  </div>
);

export default DoctorDetails;