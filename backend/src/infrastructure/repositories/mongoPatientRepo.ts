import { PatientModel, IPatient } from "../models/PatientModel";

export class MongoPatientRepository {
  async createPatient(data: Partial<IPatient>): Promise<IPatient> {
    const patient = new PatientModel(data);
    return await patient.save();
  }

  async getAllPatients(): Promise<IPatient[]> {
    return await PatientModel.find().populate("user");
  }

  async getPatientById(id: string): Promise<IPatient | null> {
    return await PatientModel.findById(id).populate("user");
  }

  async getPatientByUserId(userId: string): Promise<IPatient | null> {
    return await PatientModel.findOne({ user: userId }).populate("user");
  }

  async updatePatient(id: string, updates: Partial<IPatient>): Promise<IPatient | null> {
    return await PatientModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async deletePatient(id: string): Promise<void> {
    await PatientModel.findByIdAndDelete(id);
  }
}
