import { MongoPatientRepository } from "../../infrastructure/repositories/mongoPatientRepo";
import { IPatient } from "../../infrastructure/models/PatientModel";

const patientRepo = new MongoPatientRepository();

export class PatientService {
  async createPatient(data: Partial<IPatient>) {
    return await patientRepo.createPatient(data);
  }

  async getAllPatients() {
    return await patientRepo.getAllPatients();
  }

  async getPatientById(id: string) {
    return await patientRepo.getPatientById(id);
  }

  async getPatientByUserId(userId: string) {
    return await patientRepo.getPatientByUserId(userId);
  }

  async updatePatient(id: string, updates: Partial<IPatient>) {
    return await patientRepo.updatePatient(id, updates);
  }

  async deletePatient(id: string) {
    return await patientRepo.deletePatient(id);
  }
}
