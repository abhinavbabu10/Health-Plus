import { AppointmentModel, IAppointment } from "../models/AppointmentModel";

export class MongoAppointmentRepository {
  async createAppointment(data: Partial<IAppointment>): Promise<IAppointment> {
    return await AppointmentModel.create(data);
  }

  async getAllAppointments(): Promise<IAppointment[]> {
    return await AppointmentModel.find()
      .populate("doctor")
      .populate("patient")
      .sort({ date: 1 });
  }

  async getAppointmentById(id: string): Promise<IAppointment | null> {
    return await AppointmentModel.findById(id)
      .populate("doctor")
      .populate("patient");
  }

  async updateAppointment(
    id: string,
    updates: Partial<IAppointment>
  ): Promise<IAppointment | null> {
    return await AppointmentModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteAppointment(id: string): Promise<IAppointment | null> {
    return await AppointmentModel.findByIdAndDelete(id);
  }
}
