import { Router, Request, Response, NextFunction } from "express";
import { DoctorController } from "../controllers/doctorController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();
const doctorController = new DoctorController();

router.get("/", (req: Request, res: Response, next: NextFunction) =>
  doctorController.getAllDoctors(req, res, next)
);

router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  doctorController.getDoctorById(req, res, next)
);


router.post(
  "/",
  authMiddleware(["admin"]),
  roleMiddleware(["admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    doctorController.createDoctor(req, res, next)
);

router.put(
  "/:id",
  authMiddleware(["admin", "doctor"]),
  roleMiddleware(["admin", "doctor"]),
  (req: Request, res: Response, next: NextFunction) =>
    doctorController.updateDoctor(req, res, next)
);

router.delete(
  "/:id",
  authMiddleware(["admin"]),
  roleMiddleware(["admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    doctorController.deleteDoctor(req, res, next)
);

export { router as doctorRoutes };
