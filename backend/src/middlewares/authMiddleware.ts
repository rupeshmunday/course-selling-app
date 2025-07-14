// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const authService = new AuthService();

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = authService.verify(token) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.jti || !decoded.userId) {
      return res.status(403).json({ message: "Forbidden: Invalid token structure" });
    }

    const isValid = await authService.isTokenValid(decoded.userId, decoded.jti);
    if (!isValid) {
      return res.status(403).json({ message: "Forbidden: Token has been invalidated" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token", error: (err as Error).message });
  }
};
