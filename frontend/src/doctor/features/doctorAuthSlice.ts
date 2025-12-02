import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  role: "doctor";
}

export interface DoctorProfile {
  id: string;
  specialization: string;
  experience: number;
  qualifications: string[];
  licenseNumber: string;
  clinic?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

interface DoctorAuthState {
  doctorToken: string | null;
  doctor: Doctor | null;
  doctorProfile: DoctorProfile | null;
  loading: boolean;
  error: string | null;
}

const savedDoctor = localStorage.getItem("doctorData");
const parsedDoctor: Doctor | null =
  savedDoctor && savedDoctor !== "undefined"
    ? JSON.parse(savedDoctor)
    : null;

const initialState: DoctorAuthState = {
  doctorToken: localStorage.getItem("doctorToken"),
  doctor: parsedDoctor,
  doctorProfile: null,
  loading: false,
  error: null,
};




export const doctorLogin = createAsyncThunk<
  { token: string; doctor: Doctor },
  { email: string; password: string },
  { rejectValue: string }
>("doctor/login", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/doctor/auth/login`, formData);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
    return rejectWithValue("Login failed");
  }
});


export const fetchDoctorProfile = createAsyncThunk<
  DoctorProfile,
  void,
  { state: RootState; rejectValue: string }
>(
  "doctor/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().doctorAuth.doctorToken;
    if (!token) {
      return rejectWithValue("Token missing");
    }

    try {
      const res = await axios.get(`${API_URL}/doctor/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as DoctorProfile;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to fetch profile");
    }
  }
);



export const createOrUpdateDoctorProfile = createAsyncThunk<
  DoctorProfile,
  FormData,
  { state: RootState; rejectValue: string }
>(
  "doctor/createOrUpdateProfile",
  async (data, { getState, rejectWithValue }) => {
    const token = getState().doctorAuth.doctorToken;
    if (!token) {
 
      return rejectWithValue("Token missing");
    }

    try {
      const res = await axios.post(`${API_URL}/doctor/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data) {
        return rejectWithValue("No data returned from API");
      }

      return res.data as DoctorProfile;
    } catch (err: unknown) {

      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Failed to submit profile");
      }
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to submit profile");
    }
  }
);



const doctorAuthSlice = createSlice({
  name: "doctorAuth",
  initialState,
  reducers: {
    doctorLogout(state) {
      state.doctor = null;
      state.doctorToken = null;
      state.doctorProfile = null;
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("doctorData");
    },
    setDoctorError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(doctorLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        doctorLogin.fulfilled,
        (state, action: PayloadAction<{ token: string; doctor: Doctor }>) => {
          state.loading = false;
          state.doctor = action.payload.doctor;
          state.doctorToken = action.payload.token;

          if (action.payload.token) localStorage.setItem("doctorToken", action.payload.token);
          if (action.payload.doctor) localStorage.setItem("doctorData", JSON.stringify(action.payload.doctor));
        }
      )
      .addCase(doctorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

   
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action: PayloadAction<DoctorProfile>) => {
        state.loading = false;
        state.doctorProfile = action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      })

    
      .addCase(createOrUpdateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateDoctorProfile.fulfilled, (state, action: PayloadAction<DoctorProfile>) => {
        state.loading = false;
        state.doctorProfile = action.payload;
      })
      .addCase(createOrUpdateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit profile";
      });
  },
});

export const { doctorLogout, setDoctorError } = doctorAuthSlice.actions;
export const selectDoctorAuth = (state: RootState) => state.doctorAuth;
export default doctorAuthSlice.reducer;
