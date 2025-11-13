import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { JWT_SECRET, EMAIL_USER, EMAIL_PASS } from "../../config/environment";
import { MongoUserRepo } from "../repositories/mongoUserRepo";
import { IUser } from "../models/UserModel";

const userRepo = new MongoUserRepo();

export class AuthService {

    private otpStore = new Map<string, string>();

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "doctor" | "patient";
  }) {
    const existingUser = await userRepo.findByEmail(userData.email);
    if (existingUser) throw new Error("Email already registered");

    const allowedRoles = ["admin", "doctor", "patient"];
    if (!allowedRoles.includes(userData.role)) {
      throw new Error("Invalid role");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user: Partial<IUser> = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    };

    const newUser = await userRepo.createUser(user);

   
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(userData.email, otp);


   
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: newUser.email,
      subject: "Welcome to HealthPlus 🎉",
      text: `Hello ${newUser.name}, your account as a ${newUser.role} has been created successfully.`,
    });

    return { user: newUser, token };
  }


  async verifyOtp(email: string, enteredOtp: string) {
    const storedOtp = this.otpStore.get(email);
    if (!storedOtp || storedOtp !== enteredOtp) {
      throw new Error("Invalid or expired OTP");
    }

    this.otpStore.delete(email); 

    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User not found");


    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { message: "OTP verified successfully", token };
  }

  

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { user, token };
  }
}
