import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { RootState } from "../../app/store";
import { loginUser } from "../../app/api/authApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export interface User {
  id: string;
  name: string;
  role: "admin" | "doctor" | "patient";
  isBlocked?: boolean; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("userToken") || null,
  user: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")!)
    : null,
  loading: false,
  error: null,
};

export const selectAuth = (state: RootState) => state.auth;


export const signupUser = createAsyncThunk<
  { message: string },
  {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    gender: string;
    dob: string;
    address?: string;
    role: string;
  },
  { rejectValue: string }
>("auth/signupUser", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message ?? "Signup failed");
  }
});


export const verifyOtp = createAsyncThunk<
  { token: string; user: User },
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyOtp", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/verify-otp`,
      { email, otp },
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message ?? "OTP verification failed");
  }
});


export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    return response as { token: string; user: User };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message ?? "Login failed");
  }
});


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
    },

    loadUserFromStorage(state) {
      const storedToken = localStorage.getItem("userToken");
      const storedUser = localStorage.getItem("userData");

      if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
      }
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
 
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      });

 
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;

        localStorage.setItem("userToken", action.payload.token);
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "OTP verification failed";
      });

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;

          localStorage.setItem("userToken", action.payload.token);
          localStorage.setItem("userData", JSON.stringify(action.payload.user));
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout, loadUserFromStorage, setError } = authSlice.actions;
export default authSlice.reducer;
