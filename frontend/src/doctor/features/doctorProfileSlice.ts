import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchDoctorProfileApi, submitDoctorProfileApi } from "../api/doctorProfileApi";

interface DoctorProfileState {
  profile: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorProfileState = {
  profile: null,
  loading: false,
  error: null,
}; 

export const fetchDoctorProfile = createAsyncThunk(
  "doctorProfile/fetchDoctorProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.doctorAuth.doctorToken;
      if (!token) throw new Error("Unauthorized");
      return await fetchDoctorProfileApi(token);
    } catch (err: any) { 
      return rejectWithValue(err.message); 
    }
  }
);


export const submitDoctorProfile = createAsyncThunk(
  "doctorProfile/submitDoctorProfile",
  async (formData: FormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.doctorAuth.doctorToken;
      if (!token) throw new Error("Unauthorized");
      return await submitDoctorProfileApi(formData, token);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const doctorProfileSlice = createSlice({
  name: "doctorProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDoctorProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(submitDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default doctorProfileSlice.reducer;
