import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth.js";

export interface AuthRequest extends Request {
  userId: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const token = auth.slice(7);
    const payload = verifyToken(token);
    (req as AuthRequest).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
