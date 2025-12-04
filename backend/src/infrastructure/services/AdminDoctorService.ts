// src/infrastructure/services/AdminDoctorService.ts
import { DoctorRepository } from "../repositories/doctorRepository";

export class AdminDoctorService {
  private doctorRepo: DoctorRepository;

  constructor(doctorRepo: DoctorRepository) {
    this.doctorRepo = doctorRepo;
  }

  async getAllDoctors(status?: "pending" | "verified" | "rejected") {
    return await this.doctorRepo.findAll(status);
  }

  async getPendingDoctors() {
    return await this.doctorRepo.findAll("pending");
  }

  async getDoctorById(id: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }

  async approveDoctor(id: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) throw new Error("Doctor not found");

    if (doctor.isVerified()) {
      throw new Error("Doctor is already verified");
    }

    doctor.verify();

    return await this.doctorRepo.save(doctor);
  }

  async rejectDoctor(id: string, reason: string) {
    const doctor = await this.doctorRepo.findById(id);
    if (!doctor) throw new Error("Doctor not found");

    if (doctor.isRejected()) {
      throw new Error("Doctor is already rejected");
    }

    doctor.reject(reason);

    return await this.doctorRepo.save(doctor);
  }

  async getStatistics() {
    const all = await this.doctorRepo.findAll();
    const pending = await this.doctorRepo.findAll("pending");
    const verified = await this.doctorRepo.findAll("verified");
    const rejected = await this.doctorRepo.findAll("rejected");

    return {
      total: all.length,
      pending: pending.length,
      verified: verified.length,
      rejected: rejected.length
    };
  }
}