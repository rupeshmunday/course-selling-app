import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { v4 as uuidv4 } from 'uuid';
import redisClient from "../lib/redisClient"; // Adjust the import path as necessary


export class AuthService {
    // static verify(token: string) {
    //     throw new Error("Method not implemented.");
    // }
    private secret: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || "your_jwt_secret";
    }

    sign = async (payload: Record<string, any>, expiresIn: StringValue = "1h"): Promise<string> => {
        const jti = uuidv4();
        const options: SignOptions = { expiresIn };
        const payloadUpd = {
            ...payload,
            jti,
            iat: Math.floor(Date.now() / 1000), // Issued at time
        };
        const ttl = this.getTTLFromExpiry(expiresIn);
        await this.storeJTI(payload.userId, jti, ttl);
        return jwt.sign(payloadUpd, this.secret, options);
    }

    async storeJTI(userId: string, jti: string, ttl: number): Promise<void> {
        const key = `jti:${userId}:${jti}`;
        await redisClient.setEx(key, ttl, "valid"); // Expires in 1h
    }

    async invalidateToken(userId: string,jti: string): Promise<void> {
        const key = `jti:${userId}:${jti}`;
        await redisClient.del(key);
    }

    async isTokenValid(userId: string, jti: string): Promise<boolean> {
        const key = `jti:${userId}:${jti}`;
        const result = await redisClient.get(key);
        console.log(`Checking token validity for user ${userId} with JTI ${jti}:`, result);
        
        return result === "valid";
    }

    private getTTLFromExpiry(expiry: string): number {
        const match = /^(\d+)([smhd])$/.exec(expiry);
        if (!match) return 3600;

        const num = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 's': return num;
            case 'm': return num * 60;
            case 'h': return num * 3600;
            case 'd': return num * 86400;
            default: return 3600;
        }
    }


    verify(token: string): string | JwtPayload {
        return jwt.verify(token, this.secret);
    }

    signout = async (userId: string, jti: string): Promise<void> => {
        await this.invalidateToken(userId,jti);
        console.log(`Token with JTI ${jti} for user ${userId} has been invalidated.`);       
        // Optionally, you can also remove the JTI from Redis
        // const key = `jti:${userId}:${jti}`;
        // await redisClient.del(key);
    }
}
