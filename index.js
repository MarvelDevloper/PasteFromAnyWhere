import express from 'express'
const app=express()
import  dotenv from 'dotenv'
import { DBconnection } from './utils/DBconnection.js'
import { userRoute } from './route/user.route.js'
import { redis } from './utils/redis.js'
dotenv.config()
import cookieParser from 'cookie-parser'
import passport from 'passport'
import './auth/google.js'
import { pasteRoute } from './route/paste.route.js'
app.use(express.json())
app.use(express.urlencoded({extended:true}))
import cors from 'cors'

// DB connection
DBconnection()

app.use(cookieParser())

app.use(cors({
    origin: "https://paste-from-any-where-n6rbc5zk9-sanskar-sanas-projects.vercel.app",
    credentials: true
}));


app.use(passport.initialize());

//for authentication(register and login)
app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] ,session:false}));


app.use('/auth',userRoute)
app.use('/paste',pasteRoute)

const PORT=process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("The Server Started")
})
