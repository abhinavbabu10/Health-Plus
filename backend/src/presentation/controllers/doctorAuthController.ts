import { Request, Response, NextFunction } from "express";
import { DoctorAuthService } from "../../infrastructure/services/DoctorAuthService";
import { IDoctor } from "../../infrastructure/models/DoctorModel";
import { Types } from "mongoose";

const service = new DoctorAuthService();

export class DoctorAuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password } = req.body;

      const doctor: IDoctor = await service.register(fullName, email, password);

      const doctorId = (doctor._id as Types.ObjectId).toString();

      const token = service.generateToken(doctorId);

      res.status(201).json({
        token,
        doctor: {
          id: doctorId,
          fullName: doctor.fullName,
          email: doctor.email,
          role: "doctor",
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const doctor: IDoctor = await service.login(email, password);

      const doctorId = (doctor._id as Types.ObjectId).toString();
      const token = service.generateToken(doctorId);

      res.status(200).json({
        token,
        doctor: {
          id: doctorId,
          fullName: doctor.fullName,
          email: doctor.email,
          role: "doctor",
        },
      });
    } catch (err: any) {
      next(err);
    }
  }
}
