import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * 
 * @param file
 * @param folder 
 */

export async function uploadBufferToCloudinary(file: Express.Multer.File, folder = "uploads") {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided");
  }

 
  const base64Str = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64Str, {
    folder,
    resource_type: "auto",
  });

  return result;
}
