import { Request, Response } from 'express';
import { AdminDoctorService } from '../../infrastructure/services/AdminDoctorService';
import { DoctorRepository } from '../../infrastructure/repositories/doctorRepository';

const doctorRepo = new DoctorRepository();
const adminDoctorService = new AdminDoctorService(doctorRepo);

export class AdminDoctorController {


  static async getAllDoctors(req: Request, res: Response) {
    try {
      const doctors = await adminDoctorService.getAllDoctors();
      res.status(200).json({ success: true, data: doctors });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }


  static async getDoctorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doctor = await adminDoctorService.getDoctorById(id);
      res.status(200).json({ success: true, data: doctor });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  static async approveDoctor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doctor = await adminDoctorService.approveDoctor(id);
      res.status(200).json({ success: true, message: 'Doctor verified successfully', data: doctor });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async rejectDoctor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const doctor = await adminDoctorService.rejectDoctor(id, reason);
      res.status(200).json({ success: true, message: 'Doctor rejected', data: doctor });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
