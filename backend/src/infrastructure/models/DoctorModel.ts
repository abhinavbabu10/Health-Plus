import { Schema, model, Document, Types } from "mongoose";

export interface IDoctor extends Document {
  userId: Types.ObjectId;
  specialization: string;
  experience: number;
  fees: number;
  availableDays: string[];
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    availableDays: { type: [String], required: true },
  },
  { timestamps: true }
);

export const DoctorModel = model<IDoctor>("Doctor", doctorSchema);
