import { DoctorProfileModel, IDoctorProfile } from "../models/DoctorProfileModel";

export class DoctorProfileService {
  async createProfile(doctorId: string, data: Partial<IDoctorProfile>): Promise<IDoctorProfile> {
    const exists = await DoctorProfileModel.findOne({ doctorId });
    if (exists) throw new Error("Profile already exists");

    const profile = new DoctorProfileModel({
      doctorId,
      ...data,
    });

    await profile.save();
    return profile;
  }

  async getProfileByDoctorId(doctorId: string): Promise<IDoctorProfile | null> {
    return await DoctorProfileModel.findOne({ doctorId });
  }

  async updateProfile(doctorId: string, data: Partial<IDoctorProfile>): Promise<IDoctorProfile> {
    const profile = await DoctorProfileModel.findOneAndUpdate(
      { doctorId },
      { $set: data },
      { new: true }
    );

    if (!profile) throw new Error("Profile not found");
    return profile;
  }
}
