import { Schema, model, Document, Types } from "mongoose";

interface IMedicine {
  name: string;
  dose: string;
  duration: string;
}

export interface IPrescription extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  medicines: IMedicine[];
  notes?: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment",
     required: true,
      unique: true},
    medicines: [
      {
        name: { type: String, required: true },
        dose: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
     notes: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

export const PrescriptionModel = model<IPrescription>("Prescription", prescriptionSchema);
