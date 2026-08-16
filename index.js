import express from 'express'
const app=express()
import  dotenv from 'dotenv'
import { DBconnection } from './utils/DBconnection.js'
import { userRoute } from './route/user.route.js'
import { redis } from './utils/redis.js'
dotenv.config()
import cookieParser from 'cookie-parser'
import { pasteRoute } from './route/paste.route.js'
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// DB connection
DBconnection()


app.use(cookieParser())


//for authentication(register and login)
app.use('/auth',userRoute)
app.use('/paste',pasteRoute)

const PORT=process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("The Server Started")
})
