import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";

import { authRoutes } from "./presentation/routes/authRoutes";
import { doctorAuthRoutes } from './presentation/routes/doctorAuthRoutes';
import { adminAuthRoutes } from "./presentation/routes/adminAuthRoutes";
import { adminPatientRoutes } from "./presentation/routes/patientRoutes";
import { adminDashboardRoutes } from "./presentation/routes/adminDashboardRoutes";
import { adminDoctorRoutes } from './presentation/routes/adminDoctorRoutes';


import { PORT } from "./config/environment";

dotenv.config();

const app = express();


app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use("/api/auth", authRoutes);
app.use('/api/doctor/auth', doctorAuthRoutes);
app.use('/api/admin/doctors', adminDoctorRoutes);




app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/patients", adminPatientRoutes);
app.use("/api/admin/doctors", adminDoctorRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);






app.use(errorMiddleware);



connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
