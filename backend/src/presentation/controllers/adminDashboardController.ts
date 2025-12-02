import { Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/UserModel";
import { AppointmentModel } from "../../infrastructure/models/AppointmentModel";

export class AdminDashboardController {
  async getSummary(req: Request, res: Response) {
    try {
      const doctors = await UserModel.countDocuments({ role: "doctor" });
      const patients = await UserModel.countDocuments({ role: "patient" });
      const appointments = await AppointmentModel.countDocuments(); 

      return res.status(200).json({
        doctors,
        patients,
        appointments,
      });
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      return res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  }
}
