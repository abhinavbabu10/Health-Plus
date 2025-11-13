import { Router } from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();


router.post("/", authMiddleware(["admin"]), createPatient);

router.get("/", authMiddleware(["admin"]), getPatients);


router.get("/:id", authMiddleware(["admin", "doctor", "patient"]), getPatientById);


router.put("/:id", authMiddleware(["admin", "patient"]), updatePatient);

router.delete("/:id", authMiddleware(["admin"]), deletePatient);

export default router;
