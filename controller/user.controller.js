import { User } from "../model/user.model.js"
import bcryptjs from 'bcryptjs'
import { generateAccessToken, generateEmailToken, generateRefreshToken } from "../utils/emailToken.js"
import { redis } from "../utils/redis.js"
import path from "path"

export const register = async (req, res) => {
    const { name, email, password, role } = req.body

    const existUser = await User.findOne({ email })

    if (existUser) {
        return res.status(400).json({ msg: 'Account Already Exist!' })
    }

    const hashPassword = await bcryptjs.hash(password, 12)

    const emailToken = generateEmailToken()

    const user = new User({
        name, email, password: hashPassword, role: role || "user"
    })

    user.emailVerificationToken = (await emailToken).toString()
    user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 10000)

    await user.save();

    return res.status(201).json({ msg: 'account created successfully!' })
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const existUser = await User.findOne({ email })

    if (!existUser) {
        console.log("i am here")
        return res.status(400).json({ success: false, msg: 'email or password not found!' })
    }

    const isValid = await bcryptjs.compare( password,existUser.password)

    if (!isValid) {
        return res.status(400).json({ success: false, msg: 'email or password not found!' })
    }

    const accessToken = await generateAccessToken(existUser._id)
    const refreshToken = await generateRefreshToken(existUser._id)

    await redis.set(
        `refresh_token:${refreshToken}`,
        existUser._id.toString(),
        "EX",
        7 * 24 * 60 * 60
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/api/verifyRefresh",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return res.status(200).json({ success: true, msg: 'login successfully done', token: accessToken, refreshToken: refreshToken })
}

export const verifyRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    console.log(refreshToken)

    const userId = await redis.get(`refresh_token:${refreshToken}`);

    if (!userId) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
    const accessToken = await generateAccessToken(userId)
    const refresh = await generateRefreshToken(userId)

    await redis.set(
        `refresh_token:${refresh}`,
        userId.toString(),
        "EX",
        7 * 24 * 60 * 60
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth/api/verifyRefresh",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ succes: true, msg: 'accessToken provided', token: accessToken })
}