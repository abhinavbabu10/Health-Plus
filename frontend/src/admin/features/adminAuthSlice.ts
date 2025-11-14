import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

interface AdminState {
  adminToken: string | null;
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  adminToken: localStorage.getItem("adminToken") || null,
  adminUser: localStorage.getItem("adminUser")
    ? JSON.parse(localStorage.getItem("adminUser")!)
    : null,
  loading: false,
  error: null,
};


export const adminLogin = createAsyncThunk<
  { token: string; user: AdminUser },
  { email: string; password: string },
  { rejectValue: string }
>("adminAuth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/admin/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    if (!data.user || data.user.role !== "admin") {
      return rejectWithValue("Unauthorized access — Admins only");
    }


    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));

    return { token: data.token, user: data.user };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Invalid credentials");
    }
    return rejectWithValue("Admin login failed");
  }
});

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
  

    adminLogout: (state) => {
      state.adminToken = null;
      state.adminUser = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    },

 
    clearAdminError: (state) => {
      state.error = null;
    },


    loadAdminFromStorage: (state) => {
      const token = localStorage.getItem("adminToken");
      const user = localStorage.getItem("adminUser");
      if (token && user) {
        state.adminToken = token;
        state.adminUser = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        adminLogin.fulfilled,
        (state, action: PayloadAction<{ token: string; user: AdminUser }>) => {
          state.loading = false;
          state.adminToken = action.payload.token;
          state.adminUser = action.payload.user;
        }
      )
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});



export const selectAdminAuth = (state: RootState) => state.adminAuth;
export const { adminLogout, clearAdminError, loadAdminFromStorage } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
