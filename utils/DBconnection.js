import mongoose from "mongoose";

export const DBconnection=async()=>{
    const connection=await mongoose.connect(process.env.DBURL)
    console.log("DB connected")
}