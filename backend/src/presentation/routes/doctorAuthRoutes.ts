import express from "express";
import { DoctorAuthController } from "../controllers/doctorAuthController"

const router = express.Router();
const controller = new DoctorAuthController();

// POST /api/doctor/auth/login
router.post("/login", controller.login);

// POST /api/doctor/auth/register (optional)
router.post("/register", controller.register);

export { router as doctorAuthRoutes };
