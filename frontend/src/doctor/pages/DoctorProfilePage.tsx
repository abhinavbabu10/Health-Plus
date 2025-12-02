// src/doctor/pages/DoctorProfilePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { selectDoctorAuth } from "../features/doctorAuthSlice";
import { submitDoctorProfile, fetchDoctorProfile } from "../features/doctorProfileSlice";

/**
 * Strict, client-side validated Doctor Profile Page.
 * - All fields required and validated with helpful messages
 * - Files validated for type and size (<= 10MB)
 * - Submit button disabled until form is valid
 * - Shows previews and file meta
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_DOC_TYPES = ["application/pdf", ...ALLOWED_IMAGE_TYPES];

type FileKey = "license" | "certificate" | "profilePhoto" | "govtId" | "experienceCert";

const DoctorProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { doctorToken } = useAppSelector(selectDoctorAuth);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    specialization: "",
    experience: "" as string, // keep as string to validate empty vs number
    qualifications: "" as string, // comma separated
    licenseNumber: "",
    clinic: { name: "", address: "", city: "", state: "", pincode: "" },
    // files
    license: null as File | null,
    certificate: null as File | null,
    profilePhoto: null as File | null,
    govtId: null as File | null,
    experienceCert: null as File | null,
  });

  const [filePreviews, setFilePreviews] = useState<Record<FileKey, string | null>>({
    license: null,
    certificate: null,
    profilePhoto: null,
    govtId: null,
    experienceCert: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Load existing profile (prefill text only) ---
  useEffect(() => {
    if (!doctorToken) {
      setLoadingProfile(false);
      return;
    }
    (async () => {
      try {
        const profile = await dispatch(fetchDoctorProfile()).unwrap();
        if (profile) {
          setForm((prev) => ({
            ...prev,
            specialization: profile.specialization || "",
            experience: profile.experience?.toString() ?? "",
            qualifications: Array.isArray(profile.qualifications) ? profile.qualifications.join(", ") : (profile.qualifications || ""),
            licenseNumber: profile.licenseNumber || "",
            clinic: profile.clinic || { name: "", address: "", city: "", state: "", pincode: "" },
            // files will remain null (doctor must re-upload)
          }));
        }
      } catch (e) {
        // no profile or fetch error - ignore (doctor can create)
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [doctorToken, dispatch]);

  // --- Helpers: validation regex / checks ---
  const licenseRegex = useMemo(() => {
    // generic license pattern: letters, numbers, dashes, slashes, between 4 and 40 chars
    return /^[A-Za-z0-9\-\/]{4,40}$/;
  }, []);

  const pincodeRegex = useMemo(() => /^[0-9]{5,7}$/, []);

  // parse qualifications into array
  const qualificationsArray = useMemo(() => {
    return form.qualifications
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [form.qualifications]);

  // --- Validation logic ---
  const validateAll = (): Record<string, string> => {
    const e: Record<string, string> = {};

    // specialization
    if (!form.specialization.trim()) e.specialization = "Specialization is required.";
    else if (form.specialization.trim().length < 2) e.specialization = "Enter a valid specialization.";

    // experience
    if (!form.experience.trim()) e.experience = "Experience is required.";
    else {
      const num = Number(form.experience);
      if (Number.isNaN(num)) e.experience = "Experience must be a number.";
      else if (!Number.isFinite(num) || num < 0 || num > 80) e.experience = "Enter experience between 0 and 80 years.";
    }

    // qualifications
    if (qualificationsArray.length === 0) e.qualifications = "At least one qualification is required.";
    else if (qualificationsArray.some((q) => q.length < 2 || q.length > 50)) e.qualifications = "Each qualification should be 2–50 characters.";

    // license number
    if (!form.licenseNumber.trim()) e.licenseNumber = "License number is required.";
    else if (!licenseRegex.test(form.licenseNumber.trim())) e.licenseNumber = "License number contains invalid characters.";

    // clinic fields
    ["name", "address", "city", "state", "pincode"].forEach((key) => {
      const v = (form.clinic as any)[key] || "";
      if (!String(v).trim()) e[`clinic.${key}`] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
    });

    // pincode format
    if (form.clinic.pincode && !pincodeRegex.test(form.clinic.pincode)) e["clinic.pincode"] = "Pincode must be 5–7 digits.";

    // files: license & certificate required
    const fileChecks: { key: FileKey; required: boolean; allowed: string[] }[] = [
      { key: "license", required: true, allowed: ALLOWED_DOC_TYPES },
      { key: "certificate", required: true, allowed: ALLOWED_DOC_TYPES },
      { key: "profilePhoto", required: false, allowed: ALLOWED_IMAGE_TYPES },
      { key: "govtId", required: false, allowed: ALLOWED_DOC_TYPES },
      { key: "experienceCert", required: false, allowed: ALLOWED_DOC_TYPES },
    ];

    fileChecks.forEach(({ key, required, allowed }) => {
      const f = form[key];
      if (!f) {
        if (required) e[key] = "This document is required.";
      } else {
        // type check
        if (!allowed.includes(f.type)) {
          e[key] = `Invalid file type. Allowed: ${allowed.map((t) => t.split("/")[1]).join(", ")}.`;
        } else if (f.size > MAX_FILE_SIZE) {
          e[key] = `File is too large. Maximum ${MAX_FILE_SIZE / (1024 * 1024)} MB allowed.`;
        }
      }
    });

    return e;
  };

  // run validation whenever form changes (keeps UI responsive)
  useEffect(() => {
    setErrors(validateAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // whether form is valid
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // --- File change handler with previews ---
  const handleFile = (key: FileKey, file: File | null) => {
    setForm((prev) => ({ ...prev, [key]: file }));
    // preview for images
    if (file && ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file);
      setFilePreviews((p) => ({ ...p, [key]: url }));
    } else {
      setFilePreviews((p) => ({ ...p, [key]: null }));
    }
  };

  // --- Text handlers ---
  const handleText = (path: string, value: string) => {
    if (path.startsWith("clinic.")) {
      const key = path.split(".")[1];
      setForm((prev) => ({ ...prev, clinic: { ...prev.clinic, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [path]: value }));
    }
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentErrors = validateAll();
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!doctorToken) {
      alert("You must be logged in.");
      return;
    }

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("specialization", form.specialization.trim());
      fd.append("experience", form.experience.trim());
      qualificationsArray.forEach((q) => fd.append("qualifications", q));
      fd.append("licenseNumber", form.licenseNumber.trim());
      Object.entries(form.clinic).forEach(([k, v]) => fd.append(`clinic[${k}]`, String(v)));

      ["license", "certificate", "profilePhoto", "govtId", "experienceCert"].forEach((key) => {
        const f = (form as any)[key] as File | null;
        if (f) fd.append(key, f);
      });

      await dispatch(submitDoctorProfile(fd)).unwrap();
      // on success redirect to dashboard
      navigate("/doctor/dashboard");
    } catch (err: any) {
      // show server error or generic message
      alert(err?.message || "Failed to save profile. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // small component to display file meta
  const FileMeta: React.FC<{ f: File | null }> = ({ f }) => {
    if (!f) return null;
    return (
      <div className="text-xs text-gray-600 mt-1">
        {f.name} • {(f.size / 1024).toFixed(1)} KB • {f.type}
      </div>
    );
  };

  if (loadingProfile) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="doctor-profile-bg min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6">
        <div className="glass-card p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Complete Your Profile</h1>

          {/* Top validation summary */}
          {!isValid && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-6">
              <strong>Please fix the following errors:</strong>
              <ul className="mt-2 list-disc ml-6">
                {Object.entries(errors).map(([k, v]) => (
                  <li key={k}>{v}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input className="input-field mt-1" value={form.specialization} onChange={(e) => handleText("specialization", e.target.value)} />
                {errors.specialization && <div className="text-red-500 text-sm mt-1">{errors.specialization}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                <input type="number" className="input-field mt-1" value={form.experience} onChange={(e) => handleText("experience", e.target.value)} min={0} max={80} />
                {errors.experience && <div className="text-red-500 text-sm mt-1">{errors.experience}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Qualifications (comma separated)</label>
                <input className="input-field mt-1" value={form.qualifications} onChange={(e) => handleText("qualifications", e.target.value)} />
                {errors.qualifications && <div className="text-red-500 text-sm mt-1">{errors.qualifications}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input className="input-field mt-1" value={form.licenseNumber} onChange={(e) => handleText("licenseNumber", e.target.value)} />
                {errors.licenseNumber && <div className="text-red-500 text-sm mt-1">{errors.licenseNumber}</div>}
              </div>
            </div>

            {/* Clinic */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Clinic / Affiliation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Name</label>
                  <input className="input-field mt-1" value={form.clinic.name} onChange={(e) => handleText("clinic.name", e.target.value)} />
                  {errors["clinic.name"] && <div className="text-red-500 text-sm mt-1">{errors["clinic.name"]}</div>}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Address</label>
                  <input className="input-field mt-1" value={form.clinic.address} onChange={(e) => handleText("clinic.address", e.target.value)} />
                  {errors["clinic.address"] && <div className="text-red-500 text-sm mt-1">{errors["clinic.address"]}</div>}
                </div>
                <div>
                  <label className="text-sm text-gray-700">City</label>
                  <input className="input-field mt-1" value={form.clinic.city} onChange={(e) => handleText("clinic.city", e.target.value)} />
                  {errors["clinic.city"] && <div className="text-red-500 text-sm mt-1">{errors["clinic.city"]}</div>}
                </div>
                <div>
                  <label className="text-sm text-gray-700">State</label>
                  <input className="input-field mt-1" value={form.clinic.state} onChange={(e) => handleText("clinic.state", e.target.value)} />
                  {errors["clinic.state"] && <div className="text-red-500 text-sm mt-1">{errors["clinic.state"]}</div>}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Pincode</label>
                  <input className="input-field mt-1" value={form.clinic.pincode} onChange={(e) => handleText("clinic.pincode", e.target.value)} />
                  {errors["clinic.pincode"] && <div className="text-red-500 text-sm mt-1">{errors["clinic.pincode"]}</div>}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License */}
                <div>
                  <label className="text-sm font-medium">License (PDF or image) *</label>
                  <input type="file" accept={ALLOWED_DOC_TYPES.join(",")} className="input-field mt-1" onChange={(e) => handleFile("license", e.target.files?.[0] ?? null)} />
                  <FileMeta f={form.license} />
                  {filePreviews.license && <img src={filePreviews.license} alt="license" className="mt-2 max-h-28 object-contain border rounded" />}
                  {errors.license && <div className="text-red-500 text-sm mt-1">{errors.license}</div>}
                </div>

                {/* Certificate */}
                <div>
                  <label className="text-sm font-medium">Certificate (PDF or image) *</label>
                  <input type="file" accept={ALLOWED_DOC_TYPES.join(",")} className="input-field mt-1" onChange={(e) => handleFile("certificate", e.target.files?.[0] ?? null)} />
                  <FileMeta f={form.certificate} />
                  {filePreviews.certificate && <img src={filePreviews.certificate} alt="certificate" className="mt-2 max-h-28 object-contain border rounded" />}
                  {errors.certificate && <div className="text-red-500 text-sm mt-1">{errors.certificate}</div>}
                </div>

                {/* Profile photo */}
                <div>
                  <label className="text-sm font-medium">Profile Photo (jpg/png)</label>
                  <input type="file" accept={ALLOWED_IMAGE_TYPES.join(",")} className="input-field mt-1" onChange={(e) => handleFile("profilePhoto", e.target.files?.[0] ?? null)} />
                  <FileMeta f={form.profilePhoto} />
                  {filePreviews.profilePhoto && <img src={filePreviews.profilePhoto} alt="profile" className="mt-2 w-28 h-28 object-cover rounded-full border" />}
                  {errors.profilePhoto && <div className="text-red-500 text-sm mt-1">{errors.profilePhoto}</div>}
                </div>

                {/* Govt ID */}
                <div>
                  <label className="text-sm font-medium">Government ID (pdf/jpg)</label>
                  <input type="file" accept={ALLOWED_DOC_TYPES.join(",")} className="input-field mt-1" onChange={(e) => handleFile("govtId", e.target.files?.[0] ?? null)} />
                  <FileMeta f={form.govtId} />
                  {filePreviews.govtId && <img src={filePreviews.govtId} alt="govt" className="mt-2 max-h-28 object-contain border rounded" />}
                  {errors.govtId && <div className="text-red-500 text-sm mt-1">{errors.govtId}</div>}
                </div>

                {/* Experience certificate */}
                <div>
                  <label className="text-sm font-medium">Experience Certificate (optional)</label>
                  <input type="file" accept={ALLOWED_DOC_TYPES.join(",")} className="input-field mt-1" onChange={(e) => handleFile("experienceCert", e.target.files?.[0] ?? null)} />
                  <FileMeta f={form.experienceCert} />
                  {filePreviews.experienceCert && <img src={filePreviews.experienceCert} alt="exp" className="mt-2 max-h-28 object-contain border rounded" />}
                  {errors.experienceCert && <div className="text-red-500 text-sm mt-1">{errors.experienceCert}</div>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isValid || submitting}
                className={`w-full py-3 rounded-lg text-white font-medium transition ${
                  !isValid || submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// small component to display file meta (re-used)
const FileMeta: React.FC<{ f: File | null }> = ({ f }) => {
  if (!f) return null;
  return (
    <div className="text-xs text-gray-600 mt-1">
      {f.name} • {(f.size / 1024).toFixed(1)} KB • {f.type}
    </div>
  );
};

export default DoctorProfilePage;

/* ============================
   Remember to include CSS (if not already):
   .doctor-profile-bg { background: linear-gradient(135deg,#e0f7ff,#f5f9ff 40%,#fff); min-height:100vh; padding:40px 0; }
   .glass-card { backdrop-filter: blur(10px); background: rgba(255,255,255,0.75); border-radius: 12px; }
   .input-field { width:100%; padding:10px 12px; border:1px solid #d6d6d6; border-radius:8px; }
   ============================ */

