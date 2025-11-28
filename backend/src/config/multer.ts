import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, JPEG, PDF allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
