import { Router } from "express";
import { AdminDashboardController } from "../controllers/adminDashboardController";

const router = Router();
const controller = new AdminDashboardController();

router.get("/summary", controller.getSummary);

export { router as adminDashboardRoutes };
