import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UserModel } from "../../infrastructure/models/UserModel";
import { EMAIL_USER, EMAIL_PASS, JWT_SECRET } from "../../config/environment";

interface PendingUser {
  fullName: string;
  email: string;
  password: string; 
  role: "patient" | "doctor";
  gender?: "male" | "female" | "other";
  dob?: string;
}

const otpStore: Record<string, PendingUser | string> = {};

export class AuthController {


  async signup(req: Request, res: Response) {
    try {
      const { fullName, email, password, role, gender, dob } = req.body;

      if (!fullName || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existing = await UserModel.findOne({ email });
      if (existing) return res.status(400).json({ message: "User already exists" });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[email] = otp;
    console.log(`✅ Generated OTP for ${email}: ${otp}`);
    console.log(`otp,${otp}`)


    
      const hashedPassword = await bcrypt.hash(password, 10);

 
      otpStore[`${email}_data`] = {
        fullName,
        email,
        password: hashedPassword,
        role,
        gender,
        dob,
      };

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"HealthPlus App" <${EMAIL_USER}>`,
        to: email,
        subject: "Your HealthPlus OTP Verification Code",
        text: `Hello ${fullName},\n\nYour OTP is: ${otp}\nThis code is valid for 60 seconds.\n\nBest,\nHealthPlus Team`,
      });

      return res.status(200).json({ message: "OTP sent to your email. Please verify to complete signup." });

    } catch (error: any) {
      console.error("Signup Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const storedOtp = otpStore[email];
      if (!storedOtp) return res.status(400).json({ message: "OTP expired or not found" });
      if (storedOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });

      const userData = otpStore[`${email}_data`] as PendingUser;

      const newUser = await UserModel.create({
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        gender: userData.gender,
        dob: userData.dob,
      });

      delete otpStore[email];
      delete otpStore[`${email}_data`];

      return res.status(201).json({
        message: "Email verified successfully. User created.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          gender: newUser.gender,
          dob: newUser.dob,
        },
      });

    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const userData = otpStore[`${email}_data`] as PendingUser;
      if (!userData) return res.status(400).json({ message: "User data not found. Please sign up again." });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[email] = otp;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"HealthPlus App" <${EMAIL_USER}>`,
        to: email,
        subject: "New OTP Code - HealthPlus App",
        text: `Hello ${userData.fullName},\n\nYour new OTP is: ${otp}\nIt is valid for 60 seconds.\n\nBest,\nHealthPlus Team`,
      });

      return res.status(200).json({ message: "New OTP sent successfully." });

    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      return res.status(500).json({ message: "Failed to resend OTP." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.isBlocked) {
  return res.status(403).json({ message: "Your account has been blocked by the admin." });
}


      if (user.role === "admin") {
        return res.status(403).json({ message: "Admins cannot log in from the user side." });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          gender: user.gender,
          dob: user.dob,
        },
      });

    } catch (error: any) {
      console.error("Login Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
