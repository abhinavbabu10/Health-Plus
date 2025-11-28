import { Router } from "express";
import { AdminDoctorController } from "../controllers/adminDoctorController";

const router = Router();

router.get("/", AdminDoctorController.getAllDoctors);
router.get("/:id", AdminDoctorController.getDoctorById);
router.post("/:id/approve", AdminDoctorController.approveDoctor);
router.post("/:id/reject", AdminDoctorController.rejectDoctor);

export const adminDoctorRoutes = router;
