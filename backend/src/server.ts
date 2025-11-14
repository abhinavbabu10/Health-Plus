import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import { authRoutes } from "./presentation/routes/authRoutes";
import { doctorAuthRoutes } from "./presentation/routes/doctorAuthRoutes";

// import { appointmentRoutes } from "./presentation/routes/appointmentRoutes";
import { prescriptionRoutes } from "./presentation/routes/prescriptionRoutes";
import patientRoutes from "./presentation/routes/patientRoutes";
import { adminAuthRoutes } from "./presentation/routes/adminAuthRoutes";

import { PORT } from "./config/environment";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use("/api/auth", authRoutes);
app.use("/api/doctor/auth", doctorAuthRoutes);
// app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
