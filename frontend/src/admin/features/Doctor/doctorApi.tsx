import axios from "axios";
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


const API = axios.create({
  baseURL: "http://localhost:5000/api/admin/doctors",
  withCredentials: true,
});
export const adminDoctorApi = {
  getDoctors() {
    return API.get<{ doctors: Doctor[] }>("/");
  },
  getDoctorById(doctorId: string) {
    return API.get<{ doctor: Doctor }>(`/${doctorId}`);
  },
  approveDoctor(doctorId: string) {
    return API.post<{ doctor: Doctor }>(`/${doctorId}/approve`);
  },

  rejectDoctor(doctorId: string, reason: string) {
    return API.post<{ doctor: Doctor }>(`/${doctorId}/reject`, { reason });
  },
};
