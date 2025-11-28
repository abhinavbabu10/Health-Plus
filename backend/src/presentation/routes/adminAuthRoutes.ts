import { Router } from "express";
import { AdminAuthController } from "../controllers/adminAuthController";

const router = Router();
const controller = new AdminAuthController();

router.post("/login", (req, res) => controller.login(req, res));

export { router as adminAuthRoutes };
