import { Router } from "express";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController";
import { upload } from "../middlewares/uploadMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();


router.post("/", authMiddleware, roleMiddleware(["doctor", "admin"]), 
upload.single("prescriptionFile"), 
createPrescription);



router.get("/", authMiddleware, getPrescriptions);
router.get("/:id", authMiddleware, getPrescriptionById);


router.put("/:id", authMiddleware, roleMiddleware(["doctor", "admin"]), 
upload.single("prescriptionFile"),
updatePrescription);


router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deletePrescription);

export { router as prescriptionRoutes };
