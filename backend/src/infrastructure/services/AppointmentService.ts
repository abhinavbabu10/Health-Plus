import { MongoAppointmentRepository } from "../../infrastructure/repositories/mongoAppointmentRepo";
import { IAppointment } from "../../infrastructure/models/AppointmentModel";

const appointmentRepo = new MongoAppointmentRepository();

export class AppointmentService {
  async createAppointment(data: Partial<IAppointment>) {
    return await appointmentRepo.createAppointment(data);
  }

  async getAppointments() {
    return await appointmentRepo.getAllAppointments();
  }

  async getAppointmentById(id: string) {
    return await appointmentRepo.getAppointmentById(id);
  }

  async updateAppointment(id: string, updates: Partial<IAppointment>) {
    return await appointmentRepo.updateAppointment(id, updates);
  }

  async deleteAppointment(id: string) {
    return await appointmentRepo.deleteAppointment(id);
  }
}
