import { DoctorModel } from "../models/DoctorModel";
import { DoctorProfileModel } from "../models/DoctorProfileModel";
import { Doctor } from "../../domain/doctor";

export class DoctorRepository {
  
  async findAll(status?: "pending" | "verified" | "rejected") {
    const filter = status ? { verificationStatus: status } : {};
    const doctors = await DoctorModel.find(filter).sort({ createdAt: -1 });

    const doctorsWithProfiles = await Promise.all(
      doctors.map(async (doc) => {
        const profile = await DoctorProfileModel.findOne({ doctorId: doc._id });
        return {
          ...doc.toJSON(),
          profile: profile ? profile.toJSON() : null
        };
      })
    );
    
    return doctorsWithProfiles;
  }

  async findById(id: string) {
    const doctorDoc = await DoctorModel.findById(id);
    if (!doctorDoc) return null;

    const profile = await DoctorProfileModel.findOne({ doctorId: id });

    return this.toDomain(doctorDoc, profile);
  }

  async save(doctor: Doctor) {
    const doctorDoc = await DoctorModel.findById(doctor.id);
    if (!doctorDoc) throw new Error("Doctor not found");

    doctorDoc.verificationStatus = doctor.verificationStatus;
    doctorDoc.rejectionReason = doctor.rejectionReason;
    
    await doctorDoc.save();


    const profile = await DoctorProfileModel.findOne({ doctorId: doctor.id });
    if (profile) {
      profile.verificationStatus = doctor.verificationStatus;
      profile.rejectionReason = doctor.rejectionReason;
      await profile.save();
    }

    return {
      ...doctorDoc.toJSON(),
      profile: profile ? profile.toJSON() : null
    };
  }

  private toDomain(doctorDoc: any, profile: any): Doctor {
    const doctor = new Doctor(
      doctorDoc._id.toString(),
      doctorDoc.fullName,
      doctorDoc.email,
      doctorDoc.verificationStatus,
      doctorDoc.rejectionReason,
      doctorDoc.createdAt,
      doctorDoc.updatedAt
    );

   
    (doctor as any).profile = profile ? profile.toJSON() : null;

    return doctor;
  }
}