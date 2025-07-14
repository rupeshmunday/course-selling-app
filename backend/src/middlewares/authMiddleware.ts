// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from "../services/AuthService";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

const authService = new AuthService();

export const authenticateJWT: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = authService.verify(token) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.jti || !decoded.userId) {
      res.status(403).json({ message: "Forbidden: Invalid token structure" });
      return;
    }

    // Cast to AuthenticatedRequest to assign the user
    (req as AuthenticatedRequest).user = decoded;

    const isValid = await authService.isTokenValid(decoded.userId, decoded.jti);
    if (!isValid) {
      res.status(403).json({ message: "Forbidden: Token has been invalidated" });
      return;
    }

    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden: Invalid token", error: (err as Error).message });
    return;
  }
};
