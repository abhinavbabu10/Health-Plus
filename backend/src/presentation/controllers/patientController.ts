import { Request, Response } from "express";
import { UserModel } from "../../infrastructure/models/UserModel";
import mongoose from "mongoose";

export class AdminPatientController {
 
  async getAllPatients(req: Request, res: Response) {
    try {
      const patients = await UserModel.find({ role: "patient" })
        .select("name email role isVerified createdAt gender dob isBlocked")
        .sort({ createdAt: -1 });

      return res.status(200).json({ patients });
    } catch (error) {
      console.error("Error fetching patients:", error);
      return res.status(500).json({ message: "Failed to fetch patients" });
    }
  }


  async blockPatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const patient = await UserModel.findOneAndUpdate(
        { _id: id, role: "patient" },
        { isBlocked: true },
        { new: true, select: "name email isBlocked" }
      );

      if (!patient) return res.status(404).json({ message: "Patient not found" });

      return res.status(200).json({ message: "Patient blocked", patient });
    } catch (error) {
      console.error("Error blocking patient:", error);
      return res.status(500).json({ message: "Failed to block patient" });
    }
  }


  async unblockPatient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const patient = await UserModel.findOneAndUpdate(
        { _id: id, role: "patient" },
        { isBlocked: false },
        { new: true, select: "name email isBlocked" }
      );

      if (!patient) return res.status(404).json({ message: "Patient not found" });

      return res.status(200).json({ message: "Patient unblocked", patient });
    } catch (error) {
      console.error("Error unblocking patient:", error);
      return res.status(500).json({ message: "Failed to unblock patient" });
    }
  }
}
