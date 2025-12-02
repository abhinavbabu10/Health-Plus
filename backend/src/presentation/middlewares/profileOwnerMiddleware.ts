import { Request, Response, NextFunction } from "express";
import { DoctorProfileModel } from "../../infrastructure/models/DoctorProfileModel";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const profileOwnerMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await DoctorProfileModel.findOne({ doctorId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

  
    req.body.profile = profile;

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
