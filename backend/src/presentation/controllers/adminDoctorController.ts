// src/presentation/controllers/adminDoctorController.ts
import { Request, Response } from 'express';
import { AdminDoctorService } from '../../infrastructure/services/AdminDoctorService';
import { DoctorRepository } from '../../infrastructure/repositories/doctorRepository';

const doctorRepo = new DoctorRepository();
const adminDoctorService = new AdminDoctorService(doctorRepo);

// GET /admin/doctors?status=pending|verified|rejected
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as "pending" | "verified" | "rejected" | undefined;
    
    // Validate status if provided
    if (status && !["pending", "verified", "rejected"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Must be 'pending', 'verified', or 'rejected'" 
      });
    }

    const doctors = await adminDoctorService.getAllDoctors(status);
    res.status(200).json({ success: true, doctors, count: doctors.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /admin/doctors/pending
export const getPendingDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await adminDoctorService.getPendingDoctors();
    res.status(200).json({ success: true, doctors, count: doctors.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /admin/doctors/statistics
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await adminDoctorService.getStatistics();
    res.status(200).json({ success: true, statistics: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /admin/doctors/:id
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await adminDoctorService.getDoctorById(id);
    res.status(200).json({ success: true, doctor });
  } catch (err: any) {
    const statusCode = err.message === "Doctor not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

// POST /admin/doctors/:id/approve
export const approveDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await adminDoctorService.approveDoctor(id);
    res.status(200).json({ 
      success: true, 
      message: "Doctor approved successfully",
      doctor 
    });
  } catch (err: any) {
    const statusCode = err.message === "Doctor not found" ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

// POST /admin/doctors/:id/reject
export const rejectDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "Rejection reason is required" 
      });
    }

    const doctor = await adminDoctorService.rejectDoctor(id, reason);
    res.status(200).json({ 
      success: true, 
      message: "Doctor rejected successfully",
      doctor 
    });
  } catch (err: any) {
    const statusCode = err.message === "Doctor not found" ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};