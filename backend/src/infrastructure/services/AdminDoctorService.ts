import { DoctorRepository } from "../repositories/doctorRepository";

export class AdminDoctorService {
  private doctorRepo: DoctorRepository;

  constructor(doctorRepo: DoctorRepository) {
    this.doctorRepo = doctorRepo;
  }

  async getAllDoctors() {
    return await this.doctorRepo.findAll();
  }

  async getDoctorById(id: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }

  async approveDoctor(id: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) throw new Error("Doctor not found");

    doctor.verify();

    return await this.doctorRepo.save(doctor);
  }

  async rejectDoctor(id: string, reason: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) throw new Error("Doctor not found");

    doctor.reject(reason);

    return await this.doctorRepo.save(doctor);
  }
}
