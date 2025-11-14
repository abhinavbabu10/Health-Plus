import { Request, Response, NextFunction } from "express";
import { DoctorAuthService } from "../../infrastructure/services/DoctorAuthService";

const service = new DoctorAuthService();

export class DoctorAuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password);

      res.status(200).json({
        success: true,
        message: "Doctor login successful",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await service.registerDoctor(data);

      res.status(201).json({
        success: true,
        message: "Doctor registered successfully",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}
