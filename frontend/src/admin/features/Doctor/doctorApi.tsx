import axios, { AxiosResponse } from "axios";

// ==================== INTERFACES ====================

export interface DoctorProfile {
  id?: string;
  doctorId?: string;
  specialization: string;
  experience: number;
  qualifications: string[];
  licenseNumber: string;
  documents: {
    profilePhoto?: string;
    license: string;
    certificate: string;
    govtId?: string;
    experienceCert?: string;
  };
  clinic?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  verificationStatus?: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: DoctorProfile;
}

export interface Statistics {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

// API Response Types
interface GetDoctorsResponse {
  success: boolean;
  doctors: Doctor[];
  count: number;
}

interface GetDoctorByIdResponse {
  success: boolean;
  doctor: Doctor;
}

interface ApproveDoctorResponse {
  success: boolean;
  message: string;
  doctor: Doctor;
}

interface RejectDoctorResponse {
  success: boolean;
  message: string;
  doctor: Doctor;
}

interface GetStatisticsResponse {
  success: boolean;
  statistics: Statistics;
}

// Raw API response types (what comes from backend before mapping)
interface RawDoctorProfile {
  id?: string;
  doctorId?: string;
  specialization: string;
  experience: number;
  qualifications?: string[];
  licenseNumber: string;
  documents?: {
    profilePhoto?: string;
    license: string;
    certificate: string;
    govtId?: string;
    experienceCert?: string;
  };
  clinic?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  verificationStatus?: string;
}

interface RawDoctor {
  id: string;
  fullName: string;
  email: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: RawDoctorProfile | null;
}

// ==================== API CONFIGURATION ====================

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin/doctors",
  withCredentials: true,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== MAPPER FUNCTIONS ====================

const mapDoctor = (doc: RawDoctor): Doctor => ({
  id: doc.id,
  fullName: doc.fullName,
  email: doc.email,
  verificationStatus: doc.verificationStatus,
  rejectionReason: doc.rejectionReason,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
  profile: doc.profile ? {
    id: doc.profile.id,
    doctorId: doc.profile.doctorId,
    specialization: doc.profile.specialization,
    experience: doc.profile.experience,
    qualifications: doc.profile.qualifications || [],
    licenseNumber: doc.profile.licenseNumber,
    documents: doc.profile.documents || {
      license: "",
      certificate: "",
    },
    clinic: doc.profile.clinic,
    verificationStatus: doc.profile.verificationStatus,
  } : undefined,
});

// ==================== API METHODS ====================

export const adminDoctorApi = {
  async getDoctors(status?: "pending" | "verified" | "rejected"): Promise<GetDoctorsResponse> {
    const url = status ? `/?status=${status}` : "/";
    const response: AxiosResponse<{ success: boolean; doctors: RawDoctor[]; count: number }> = 
      await API.get(url);
    
    const doctors = response.data.doctors?.map(mapDoctor) ?? [];
    return { 
      success: response.data.success, 
      doctors,
      count: response.data.count 
    };
  },

  async getPendingDoctors(): Promise<GetDoctorsResponse> {
    const response: AxiosResponse<{ success: boolean; doctors: RawDoctor[]; count: number }> = 
      await API.get("/pending");
    
    const doctors = response.data.doctors?.map(mapDoctor) ?? [];
    return { 
      success: response.data.success, 
      doctors,
      count: response.data.count 
    };
  },

  async getStatistics(): Promise<GetStatisticsResponse> {
    const response: AxiosResponse<{ success: boolean; statistics: Statistics }> = 
      await API.get("/statistics");
    
    return {
      success: response.data.success,
      statistics: response.data.statistics,
    };
  },

  async getDoctorById(doctorId: string): Promise<GetDoctorByIdResponse> {
    const response: AxiosResponse<{ success: boolean; doctor: RawDoctor }> = 
      await API.get(`/${doctorId}`);
    
    return {
      success: response.data.success,
      doctor: mapDoctor(response.data.doctor),
    };
  },

  async approveDoctor(doctorId: string): Promise<ApproveDoctorResponse> {
    const response: AxiosResponse<{ success: boolean; message: string; doctor: RawDoctor }> = 
      await API.post(`/${doctorId}/approve`);
    
    return {
      success: response.data.success,
      message: response.data.message,
      doctor: mapDoctor(response.data.doctor),
    };
  },

  async rejectDoctor(doctorId: string, reason: string): Promise<RejectDoctorResponse> {
    const response: AxiosResponse<{ success: boolean; message: string; doctor: RawDoctor }> = 
      await API.post(`/${doctorId}/reject`, { reason });
    
    return {
      success: response.data.success,
      message: response.data.message,
      doctor: mapDoctor(response.data.doctor),
    };
  },
};