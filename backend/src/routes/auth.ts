import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = Router();
const authController = new AuthController();


/**
 * @swagger
 * /auth/v1/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticate user and return access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns access token
 */
authRouter.post('/v1/login', authController.login);



export default authRouter;
