import { MongoDoctorRepo } from "../repositories/mongoDoctorRepo";
import { IDoctor } from "../models/DoctorModel";

const doctorRepo = new MongoDoctorRepo();

export class DoctorService {
  
  async createDoctor(data: Partial<IDoctor>) {
    if (!data.userId) throw new Error("User reference (userId) is required");
    if (!data.specialization) throw new Error("Specialization is required");
    if (!data.experience) throw new Error("Experience is required");

    const doctor = await doctorRepo.createDoctor(data);
    return doctor;
  }

  async getAllDoctors() {
    const doctors = await doctorRepo.getAllDoctors();
    return doctors;
  }


  async getDoctorById(id: string) {
    const doctor = await doctorRepo.getDoctorById(id);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }

  async updateDoctor(id: string, updateData: Partial<IDoctor>) {
    const doctor = await doctorRepo.updateDoctor(id, updateData);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }


  async deleteDoctor(id: string) {
    const doctor = await doctorRepo.deleteDoctor(id);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }
}
