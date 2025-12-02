import { Schema, model, Document, Types } from "mongoose";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface IDoctorProfile extends Document {
  doctorId: Types.ObjectId;
  specialization: string;
  experience: number;
  qualifications: string[];
  licenseNumber: string;
  documents: {
    profilePhoto?: string;
    license: string;
    certificate: string;
    govtId?: string;
    experienceCert?: string;
  };
  clinic: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, unique: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    qualifications: { type: [String], default: [] },
    licenseNumber: { type: String, required: true },
    documents: {
      profilePhoto: { type: String },
      license: { type: String, required: true },
      certificate: { type: String, required: true },
      govtId: { type: String },
      experienceCert: { type: String },
    },
    clinic: {
      name: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

DoctorProfileSchema.set("toJSON", {
  transform: (_, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const DoctorProfileModel = model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);
