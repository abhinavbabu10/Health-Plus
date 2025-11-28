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
      const res = await adminDoctorApi.getDoctorById(id);
      setDoctor(res.data.doctor);
    } catch (err) {
      console.error("Error loading doctor:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadDoctor(); }, [loadDoctor]);

  const approveDoctor = async () => {
    if (!id) return;
    try {
      await adminDoctorApi.approveDoctor(id);
      loadDoctor();
    } catch (err) {
      console.error("Error approving doctor:", err);
    }
  };

  const rejectDoctor = async () => {
    if (!id) return;
    try {
      await adminDoctorApi.rejectDoctor(id, reason);
      setRejectModal(false);
      setReason("");
      loadDoctor();
    } catch (err) {
      console.error("Error rejecting doctor:", err);
    }
  };

  if (loading) return <AdminLayout title="Loading..."><p>Loading...</p></AdminLayout>;
  if (!doctor) return <AdminLayout title="Doctor Not Found"><p>No doctor found.</p></AdminLayout>;

  return (
    <AdminLayout title={`Doctor: ${doctor.name}`}>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">{doctor.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded text-white text-sm ${
              doctor.verificationStatus === "verified" ? "bg-green-600" :
              doctor.verificationStatus === "rejected" ? "bg-red-600" : "bg-yellow-500"
            }`}>
              {doctor.verificationStatus}
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => navigate(-1)}>⬅ Back</button>
        </div>

        <hr className="my-4" />

        <section>
          <h3 className="text-lg font-semibold mb-3">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard label="Specialization" value={doctor.specialization} />
            <InfoCard label="Experience" value={doctor.experience?.toString()} />
            <InfoCard label="Phone" value={doctor.phone} />
            <InfoCard label="Bio" value={doctor.bio} span={2} />
          </div>
        </section>

        <hr className="my-5" />

        <section>
          <h3 className="text-lg font-semibold mb-3">Verification Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DocumentCard label="Medical License" url={doctor.documents?.medicalLicense} />
            <DocumentCard label="Degree Certificate" url={doctor.documents?.degreeCertificate} />
            <DocumentCard label="ID Proof" url={doctor.documents?.idProof} />
          </div>
        </section>

        <div className="flex justify-end mt-6 gap-3">
          {doctor.verificationStatus === "pending" && (
            <>
              <button onClick={approveDoctor} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approve</button>
              <button onClick={() => setRejectModal(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
            </>
          )}
          {doctor.verificationStatus === "rejected" && (
            <p className="text-red-600 text-sm">Rejected: {doctor.rejectionReason}</p>
          )}
        </div>
      </div>

      {rejectModal && (
        <RejectModal reason={reason} setReason={setReason} onClose={() => setRejectModal(false)} onReject={rejectDoctor} />
      )}
    </AdminLayout>
  );
};

const InfoCard: React.FC<{ label: string; value?: string; span?: number }> = ({ label, value, span }) => (
  <div className={`border p-3 rounded ${span === 2 ? "sm:col-span-2" : ""}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

const DocumentCard: React.FC<{ label: string; url?: string }> = ({ label, url }) => (
  <div className="border rounded p-3 text-center">
    <p className="text-xs text-gray-500">{label}</p>
    {url ? <img src={url} alt={label} className="mt-2 w-full h-32 object-cover rounded border"/> : <p className="text-gray-400 text-sm mt-3">Not uploaded</p>}
  </div>
);

export default DoctorDetails;
