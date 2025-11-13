import { Request, Response, NextFunction } from "express";
import { AppointmentService } from "../../infrastructure/services/AppointmentService";

const appointmentService = new AppointmentService();

export class AppointmentController {
  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await appointmentService.getAppointments();
      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);
      if (!appointment)
        return res.status(404).json({ success: false, message: "Appointment not found" });

      res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  }

  async updateAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = req.body;
      const user = (req as any).user;

      if (user.role === "doctor" || user.role === "admin") {
        if (!updates.status) {
          return res.status(400).json({ success: false, message: "Status is required to update" });
        }
      } else if (updates.status && updates.status !== "cancelled") {
        return res.status(403).json({ success: false, message: "Patients cannot update status" });
      }

      const updated = await appointmentService.updateAppointment(req.params.id, updates);
      if (!updated)
        return res.status(404).json({ success: false, message: "Appointment not found" });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async deleteAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await appointmentService.deleteAppointment(req.params.id);
      if (!deleted)
        return res.status(404).json({ success: false, message: "Appointment not found" });

      res.status(200).json({ success: true, message: "Appointment deleted" });
    } catch (error) {
      next(error);
    }
  }
}
