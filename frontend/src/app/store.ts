import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import adminAuthReducer from "../admin/features/adminAuthSlice"; 
import doctorAuthReducer from "../doctor/features/doctorAuthSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    doctorAuth: doctorAuthReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
