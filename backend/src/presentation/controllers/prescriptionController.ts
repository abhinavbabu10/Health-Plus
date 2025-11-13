import { Request, Response, NextFunction } from "express";
import { PrescriptionService } from "../../infrastructure/services/PrescriptionService";

const prescriptionService = new PrescriptionService();

export const createPrescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = (req as any).user.id; 
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const prescription = await prescriptionService.createPrescription(req.body, doctorId);
    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};



export const getPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prescriptions = await prescriptionService.getPrescriptions();
    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await prescriptionService.updatePrescription(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await prescriptionService.deletePrescription(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.status(200).json({ success: true, message: "Prescription deleted" });
  } catch (error) {
    next(error);
  }
};
