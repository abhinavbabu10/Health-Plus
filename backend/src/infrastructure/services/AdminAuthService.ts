import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../../infrastructure/models/UserModel";
import { Types } from "mongoose";

export class AdminAuthService {
  private jwtSecret = process.env.JWT_SECRET as string;

  // ✅ Only login for admins
  async login(email: string, password: string) {
    // Find user with admin role
    const admin = await UserModel.findOne({ email, role: "admin" });
    if (!admin) throw new Error("Invalid email or password");

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new Error("Invalid email or password");

    // Convert ID to string safely
    const adminId = (admin._id as Types.ObjectId).toString();

    // Generate token
    const token = jwt.sign({ id: adminId, role: "admin" }, this.jwtSecret, {
      expiresIn: "1d",
    });

    // ✅ Return consistent frontend structure
    return {
      token,
      user: {
        id: adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
