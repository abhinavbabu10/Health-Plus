import { DoctorModel, IDoctor } from "../models/DoctorModel";

export class MongoDoctorRepo {
  async createDoctor(data: Partial<IDoctor>): Promise<IDoctor> {
    const doctor = new DoctorModel(data);
    return await doctor.save();
  }

  async getAllDoctors(): Promise<IDoctor[]> {
    return await DoctorModel.find().populate("userId", "name email role");
  }

  async getDoctorById(id: string): Promise<IDoctor | null> {
    return await DoctorModel.findById(id).populate("userId", "name email role");
  }

  async updateDoctor(id: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
    return await DoctorModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteDoctor(id: string): Promise<IDoctor | null> {
    return await DoctorModel.findByIdAndDelete(id);
  }
}
