import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  time: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "completed", "cancelled"], default: "pending" },
    notes: { type: String },
  },
  { timestamps: true }
);

export const AppointmentModel = model<IAppointment>("Appointment", appointmentSchema);
