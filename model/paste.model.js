import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    privacy:{
        type:String,
        enum:['private','public'],
        default:'public'
    },
    content: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    expiresAt: {
        type: Date,
    }
},
    {
        timestamps: true
    }
)

pasteSchema.index(
    {expiresAt:1},
    {expireAfterSeconds:0}
);

export const Paste=mongoose.model('Paste',pasteSchema)
