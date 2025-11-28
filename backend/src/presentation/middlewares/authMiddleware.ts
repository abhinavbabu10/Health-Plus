import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email?: string;
      };
    }
  }
}

export const authMiddleware = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
        email?: string;
      };

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
