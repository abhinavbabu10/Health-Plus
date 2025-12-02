import { Request, Response, NextFunction } from "express";
import { DoctorProfileService } from "../../infrastructure/services/DoctorProfileService";
import { IDoctorProfile } from "../../infrastructure/models/DoctorProfileModel";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryUpload";

const service = new DoctorProfileService();

export class DoctorProfileController {

  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.user?.id; 
      if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

      const profileData: Partial<IDoctorProfile> = { ...req.body };
      const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

      profileData.documents = profileData.documents || {};

      const uploadIfPresent = async (field: string) => {
        const file = files?.[field]?.[0];
        if (!file) return;
        const result = await uploadBufferToCloudinary(file, `doctors/${doctorId}`);
        profileData.documents![field] = result.secure_url;
      };

      await Promise.all([
        uploadIfPresent("profilePhoto"),
        uploadIfPresent("license"),
        uploadIfPresent("certificate"),
        uploadIfPresent("govtId"),
        uploadIfPresent("experienceCert"),
      ]);

      const profile = await service.createProfile(doctorId, profileData);

      return res.status(201).json({ message: "Profile created", profile });
    } catch (err: any) {
      console.error("CREATE PROFILE ERROR:", err);
      return res.status(400).json({ message: err.message || "Failed to create profile" });
    }
  }

  
  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.user?.id;
      if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

      const profile = await service.getProfileByDoctorId(doctorId);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res.status(200).json(profile);
    } catch (err: any) {
      console.error("GET PROFILE ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }
  }


  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const doctorId = req.user?.id;
      if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

      const profileData: Partial<IDoctorProfile> = { ...req.body };
      const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;

      const documents: Partial<IDoctorProfile["documents"]> = {};

      const uploadIfPresent = async (field: string) => {
        const file = files?.[field]?.[0];
        if (!file) return;
        const result = await uploadBufferToCloudinary(file, `doctors/${doctorId}`);
        documents[field as keyof typeof documents] = result.secure_url;
      };

      await Promise.all([
        uploadIfPresent("profilePhoto"),
        uploadIfPresent("license"),
        uploadIfPresent("certificate"),
        uploadIfPresent("govtId"),
        uploadIfPresent("experienceCert"),
      ]);

      if (Object.keys(documents).length > 0) {
        profileData.documents = { ...(profileData.documents || {}), ...documents };
      }

      const updatedProfile = await service.updateProfile(doctorId, profileData);

      return res.status(200).json({ message: "Profile updated", profile: updatedProfile });
    } catch (err: any) {
      console.error("UPDATE PROFILE ERROR:", err);
      return res.status(400).json({ message: err.message || "Failed to update profile" });
    }
  }
}
