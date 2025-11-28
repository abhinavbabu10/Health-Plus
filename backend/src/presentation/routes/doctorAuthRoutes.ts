import express from "express";
import { DoctorAuthController } from "../controllers/doctorAuthController";

const router = express.Router();
const controller = new DoctorAuthController();

router.post("/register", (req, res, next) => controller.register(req, res, next));

router.post("/login", (req, res, next) => controller.login(req, res, next));

export { router as doctorAuthRoutes };
