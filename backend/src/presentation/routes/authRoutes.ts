import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

router.post("/signup", (req, res) => authController.signup(req, res));
router.post("/verify-otp", (req, res) => authController.verifyOtp(req, res));
router.post("/resend-otp", (req, res) => authController.resendOtp(req, res)); 

router.post("/login", (req, res) => authController.login(req, res));

export const authRoutes = router;
