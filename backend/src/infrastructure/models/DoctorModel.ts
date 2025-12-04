import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IDoctor extends Document {
  fullName: string;
  email: string;
  password: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String },
  },
  { timestamps: true }
);

DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

DoctorSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

DoctorSchema.set("toJSON", {
  transform: (_, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const DoctorModel = model<IDoctor>("Doctor", DoctorSchema);
