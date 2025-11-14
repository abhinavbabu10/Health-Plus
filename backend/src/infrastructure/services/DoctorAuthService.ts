import { UserModel } from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class DoctorAuthService {
  async login(email: string, password: string) {
    const doctor = await UserModel.findOne({ email, role: "doctor" });

    if (!doctor) throw new Error("Doctor not found");

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return {
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
      },
    };
  }

  async registerDoctor(data: any) {
    const exists = await UserModel.findOne({ email: data.email });
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(data.password, 10);

    const doctor = await UserModel.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: "doctor",
    });

    return { doctor };
  }
}
