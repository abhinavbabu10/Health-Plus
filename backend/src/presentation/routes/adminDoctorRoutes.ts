// src/presentation/routes/adminDoctorRoutes.ts
import { Router } from "express";
import {
  getAllDoctors,
  getPendingDoctors,
  getStatistics,
  getDoctorById,
  approveDoctor,
  rejectDoctor
} from "../controllers/adminDoctorController";

const router = Router();

// Statistics endpoint
router.get("/statistics", getStatistics);

// Pending doctors
router.get("/pending", getPendingDoctors);

// Get all doctors (with optional status filter)
router.get("/", getAllDoctors);

// Get single doctor by ID
router.get("/:id", getDoctorById);

// Approve doctor
router.post("/:id/approve", approveDoctor);

// Reject doctor
router.post("/:id/reject", rejectDoctor);

export const adminDoctorRoutes = router;