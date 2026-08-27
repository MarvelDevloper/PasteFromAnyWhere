import crypto from "crypto";
import jwt from 'jsonwebtoken'

export const generateEmailToken = async () => {
    const token = await crypto.randomBytes(32).toString("hex");
    console.log(token);
    return token
}

export const generateAccessToken = async (userId) => {
    return jwt.sign({ userId: userId }, process.env.SECRET, { expiresIn: '1h' });
}

export const generateRefreshToken = async () => {
    return crypto.randomBytes(64).toString("hex");
}