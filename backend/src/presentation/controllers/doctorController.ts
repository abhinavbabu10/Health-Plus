import { Request, Response, NextFunction } from "express";
import { DoctorService } from "../../infrastructure/services/DoctorService";

const doctorService = new DoctorService();

export class DoctorController {

  async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      res.status(201).json({ success: true, doctor });
    } catch (err) {
      next(err);
    }
  }

  async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const doctors = await doctorService.getAllDoctors();
      res.status(200).json({ success: true, doctors });
    } catch (err) {
      next(err);
    }
  }


  async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.getDoctorById(req.params.id);
      res.status(200).json({ success: true, doctor });
    } catch (err) {
      next(err);
    }
  }

 
  async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.updateDoctor(req.params.id, req.body);
      res.status(200).json({ success: true, doctor });
    } catch (err) {
      next(err);
    }
  }


  async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await doctorService.deleteDoctor(req.params.id);
      res.status(200).json({ success: true, message: "Doctor deleted", doctor });
    } catch (err) {
      next(err);
    }
  }
}
