// src/doctor/features/doctorAuthSlice.ts
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

interface DoctorAuthState {
  doctorToken: string | null;
  doctor: Doctor | null;
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


const doctorAuthSlice = createSlice({
  name: "doctorAuth",
  initialState,
  reducers: {
    doctorLogout(state) {
      state.doctor = null;
      state.doctorToken = null;
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

          if (action.payload.token) {
            localStorage.setItem("doctorToken", action.payload.token);
          }
          if (action.payload.doctor) {
            localStorage.setItem(
              "doctorData",
              JSON.stringify(action.payload.doctor)
            );
          }
        }
      )
      .addCase(doctorLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { doctorLogout, setDoctorError } = doctorAuthSlice.actions;
export const selectDoctorAuth = (state: RootState) => state.doctorAuth;
export default doctorAuthSlice.reducer;
