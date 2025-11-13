import { PrescriptionModel, IPrescription } from "../models/PrescriptionModel";

export class MongoPrescriptionRepository {
  async createPrescription(data: Partial<IPrescription>): Promise<IPrescription> {
    return await PrescriptionModel.create(data);
  }

  async getAllPrescriptions(): Promise<IPrescription[]> {
    return await PrescriptionModel.find()
      .populate("doctor")
      .populate("patient")
      .populate("appointment");
  }

  async getPrescriptionById(id: string): Promise<IPrescription | null> {
    return await PrescriptionModel.findById(id)
      .populate("doctor")
      .populate("patient")
      .populate("appointment");
  }

  async updatePrescription(
    id: string,
    updates: Partial<IPrescription>
  ): Promise<IPrescription | null> {
    return await PrescriptionModel.findByIdAndUpdate(id, updates, { new: true });
  }

async getByAppointmentId(appointmentId: string): Promise<IPrescription | null> {
  return await PrescriptionModel.findOne({ appointment: appointmentId });
}



  async deletePrescription(id: string): Promise<IPrescription | null> {
    return await PrescriptionModel.findByIdAndDelete(id);
  }
}

