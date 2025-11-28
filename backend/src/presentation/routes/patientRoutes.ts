import { Router } from "express";
import { AdminPatientController } from "../controllers/patientController";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware"; 

const router = Router();
const controller = new AdminPatientController();

router.get("/", controller.getAllPatients);


router.patch("/block/:id", adminAuthMiddleware, controller.blockPatient);
router.patch("/unblock/:id", adminAuthMiddleware, controller.unblockPatient);

export { router as adminPatientRoutes };
