import { Request, Response, NextFunction } from "express";
import { PatientService } from "../../infrastructure/services/PatientService";

const patientService = new PatientService();


export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};


export const getPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await patientService.getAllPatients();
    res.json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
};


export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};


export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await patientService.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};


export const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await patientService.deletePatient(req.params.id);
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    next(error);
  }
};
