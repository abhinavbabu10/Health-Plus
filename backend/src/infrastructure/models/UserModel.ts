import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "doctor" | "patient";
  isVerified: boolean;
  gender?: "male" | "female" | "other";
  dob?: Date;
  isBlocked?: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "doctor", "patient"], default: "patient" },
    isVerified: { type: Boolean, default: false },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    isBlocked: { type: Boolean, default: false }, 
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
