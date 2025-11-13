import { Schema, model, Document, Types } from "mongoose";

export interface IPatient extends Document {
  userId: Types.ObjectId;
  age: number;
  gender: "male" | "female" | "other";
  contactNumber?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    contactNumber: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export const PatientModel = model<IPatient>("Patient", patientSchema);
