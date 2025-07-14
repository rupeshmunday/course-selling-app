import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { IUser } from '../models/User';
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
// import { Types } from 'mongoose';

import { log } from "console";

export class AuthController {

    private userService: UserService;
    private authService: AuthService; // AuthService is not used in this code, but can be added later
    
        constructor() {
            this.userService = new UserService();
            this.authService = new AuthService(); // Initialize AuthService
        }

        login = async (req: Request, res: Response): Promise<void> => {
            log("Login request received", req.body);
            try {
                const { email, password } = req.body;
                const user : IUser | null = await this.userService.getUserByEmail(email);
                
                if (!user || typeof user._id !== 'object') {
                    res.status(404).json({ error: "User not found or invalid" });
                    return;
                }

                const isValidPassword = await this.userService.validatePassword(user, password);
                
                if (!isValidPassword) {
                    res.status(401).json({ error: "Invalid password" });
                    return;
                }

                
                const token = user && user._id ? await this.authService.sign({userId: user._id.toString(),
    email: user.email}) : ''; // Assuming sign method exists in AuthService
                // Here you would typically generate a JWT token and send it 
                console.log(token);
                
                res.json({ message: "Login successful", userId: user._id , token: token });
            } catch (error) {
                console.log("Error during login:", error);
                
                res.status(500).json({ error: "Failed to login" });
            }
        }

        logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
            log("Logout request received", req.user,req.user?.jti);
            try {
                if (!req.user || !req.user.jti || !req.user.userId) {
                    res.status(400).json({ error: "User ID and JTI are required" });
                    return;
                }
                const { userId, jti } = req.user; // Assuming jti is passed in the request body

                await this.authService.signout(userId, jti);
                res.json({ message: "Logout successful" });
            } catch (error) {
                console.log("Error during logout:", error);
                res.status(500).json({ error: "Failed to logout" });
            }
        }
    
}