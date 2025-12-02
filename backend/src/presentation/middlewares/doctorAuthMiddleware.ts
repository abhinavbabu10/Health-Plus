import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const doctorAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization token missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authorization token missing" });

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
