import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 🧑‍💼 Admin model (must match backend response)
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

// 🔐 Admin slice state
interface AdminState {
  adminToken: string | null;
  adminUser: AdminUser | null;
  loading: boolean;
  error: string | null;
}

// 🌟 Initial state (read from localStorage)
const initialState: AdminState = {
  adminToken: localStorage.getItem("adminToken") || null,
  adminUser: localStorage.getItem("adminUser")
    ? JSON.parse(localStorage.getItem("adminUser")!)
    : null,
  loading: false,
  error: null,
};

// ⚡ Admin login thunk
export const adminLogin = createAsyncThunk<
  { token: string; user: AdminUser },
  { email: string; password: string },
  { rejectValue: string }
>("adminAuth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/admin/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    // ✅ Expect correct backend shape
    if (!data.user || data.user.role !== "admin") {
      return rejectWithValue("Unauthorized access — Admins only");
    }

    // ✅ Save in localStorage with admin-only keys
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

// 🧩 Slice definition
const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    // ✅ Clear session completely
    adminLogout: (state) => {
      state.adminToken = null;
      state.adminUser = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    },
    // ✅ Clear error
    clearAdminError: (state) => {
      state.error = null;
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

// 🔹 Selectors
export const selectAdminAuth = (state: RootState) => state.adminAuth;

// 🔹 Actions
export const { adminLogout, clearAdminError } = adminAuthSlice.actions;

// 🔹 Reducer
export default adminAuthSlice.reducer;
