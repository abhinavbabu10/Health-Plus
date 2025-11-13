import { Request, Response } from "express";
import { AdminAuthService } from "../../infrastructure/services/AdminAuthService";

const adminAuthService = new AdminAuthService();

export class AdminAuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }

      const { token, user } = await adminAuthService.login(email, password);

      return res.status(200).json({
        success: true,
        token,
        user, // 👈 matches frontend
      });
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: err.message || "Login failed",
      });
    }
  }
}
