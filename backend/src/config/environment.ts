import { config } from "dotenv";
config();

export const MONGO_URI = process.env.MONGO_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
export const EMAIL_USER = process.env.EMAIL_USER!;
export const EMAIL_PASS = process.env.EMAIL_PASS!;
