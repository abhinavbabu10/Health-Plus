import { DoctorModel, IDoctor } from "../models/DoctorModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123"; 

export class DoctorAuthService {

  async register(fullName: string, email: string, password: string): Promise<IDoctor> {
    const exists = await DoctorModel.findOne({ email });
    if (exists) throw new Error("Email already registered");

    const doctor = new DoctorModel({ fullName, email, password });
    await doctor.save();
    return doctor;
  }


  async login(email: string, password: string): Promise<IDoctor> {
    const doctor = await DoctorModel.findOne({ email });
    if (!doctor) throw new Error("Invalid email or password");

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) throw new Error("Invalid email or password");

    return doctor;
  }

  generateToken(doctorId: string) {
    return jwt.sign({ id: doctorId, role: "doctor" }, JWT_SECRET, { expiresIn: "7d" });
  }
}
