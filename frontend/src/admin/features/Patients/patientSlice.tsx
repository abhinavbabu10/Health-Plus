import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Patient } from "../../../types/PatientTypes";
import { PatientFilters } from "../../../types/PatientFilterTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  filters: PatientFilters;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  filters: { search: "", gender: "", fromDate: "", toDate: "" },
};

export const fetchPatients = createAsyncThunk<
  Patient[],
  { token: string; filters: PatientFilters },
  { rejectValue: string }
>("patients/fetchPatients", async ({ token, filters }, { rejectWithValue }) => {
  try {
  const params = new URLSearchParams(
  Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)])
).toString();

    const res = await axios.get<{ patients: Patient[] }>(
      `${API_URL}/admin/patients?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.patients;
  } catch (err) {
   const e = err as AxiosError<{ message?: string }>;
return rejectWithValue(e.response?.data?.message ?? "Failed to fetch patients");
;
  }
});

export const blockUser = createAsyncThunk<
  Patient,
  { userId: string; token: string },
  { rejectValue: string }
>("patients/blockUser", async ({ userId, token }, { rejectWithValue }) => {
  try {
    const res = await axios.patch<{ patient: Patient }>(
`${API_URL}/admin/patients/block/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.patient;
  } catch (err) {
   const e = err as AxiosError<{ message?: string }>;
return rejectWithValue(e.response?.data?.message ?? "Failed to fetch patients");
;
  }
});

export const unblockUser = createAsyncThunk<
  Patient,
  { userId: string; token: string },
  { rejectValue: string }
>("patients/unblockUser", async ({ userId, token }, { rejectWithValue }) => {
  try {
    const res = await axios.patch<{ patient: Patient }>(
`${API_URL}/admin/patients/unblock/${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.patient;
  } catch (err) {
   const e = err as AxiosError<{ message?: string }>;
return rejectWithValue(e.response?.data?.message ?? "Failed to fetch patients");
;
  }
});

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<PatientFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error fetching patients";
      })

      .addCase(blockUser.fulfilled, (state, action) => {
        const idx = state.patients.findIndex((p) => p._id === action.payload._id);
        if (idx >= 0) state.patients[idx] = action.payload;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to block user";
      })

      .addCase(unblockUser.fulfilled, (state, action) => {
        const idx = state.patients.findIndex((p) => p._id === action.payload._id);
        if (idx >= 0) state.patients[idx] = action.payload;
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to unblock user";
      });
  },
});

export const { setFilter } = patientSlice.actions;
export default patientSlice.reducer;
