import express from 'express'
import { login, register, verifyRefreshToken } from '../controller/user.controller.js'
import { tokenVerify } from '../middleware/tokenVerify.js'
export const userRoute=express.Router()

userRoute.post('/api/register',register)
userRoute.post('/api/login',login)
userRoute.get('/api/verifyRefresh',verifyRefreshToken)