import { Router } from "express";
import { DoctorProfileController } from "../controllers/doctorProfileController";
import { upload } from "../../config/multer";
import { doctorAuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new DoctorProfileController();

router.post(
  "/profile",
  doctorAuthMiddleware,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "govtId", maxCount: 1 },
    { name: "experienceCert", maxCount: 1 },
  ]),
  controller.createProfile.bind(controller)
);

router.get(
  "/profile",
  doctorAuthMiddleware,
  controller.getMyProfile.bind(controller)
);

router.put(
  "/profile",
  doctorAuthMiddleware,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "govtId", maxCount: 1 },
    { name: "experienceCert", maxCount: 1 },
  ]),
  controller.updateProfile.bind(controller)
);

export default router;
