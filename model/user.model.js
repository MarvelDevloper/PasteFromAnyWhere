import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        trim:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String,
    },
    emailVerificationExpires: {
    type: Date
  }
},
{
    timestamps:true
})

export const User=mongoose.model('User',userSchema)

