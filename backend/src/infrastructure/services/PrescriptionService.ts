import { MongoPrescriptionRepository } from "../../infrastructure/repositories/mongoPrescriptionRepo";
import { IPrescription } from "../../infrastructure/models/PrescriptionModel";
import { AppointmentModel } from "../../infrastructure/models/AppointmentModel";

const prescriptionRepo = new MongoPrescriptionRepository();

export class PrescriptionService {
  async createPrescription(data: Partial<IPrescription>, currentDoctorId: string) {
    
    const appointment = await AppointmentModel.findById(data.appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    const existing = await prescriptionRepo.getByAppointmentId(data.appointmentId!.toString());
    if (existing) throw new Error("Prescription already exists for this appointment");

    if (appointment.doctorId.toString() !== currentDoctorId)
      throw new Error("You are not authorized to create prescription for this appointment");

    const prescriptionData: Partial<IPrescription> = {
      ...data,
      doctorId: appointment. doctorId,
    patientId: appointment.patientId,
    };

    return await prescriptionRepo.createPrescription(prescriptionData);
  }

  async getPrescriptions() {
    return await prescriptionRepo.getAllPrescriptions();
  }

  async getPrescriptionById(id: string) {
    return await prescriptionRepo.getPrescriptionById(id);
  }

  async updatePrescription(id: string, updates: Partial<IPrescription>) {
    return await prescriptionRepo.updatePrescription(id, updates);
  }

  async deletePrescription(id: string) {
    return await prescriptionRepo.deletePrescription(id);
  }
}
