import mongoose from "mongoose";

export const User = mongoose.model(
    "User",
    new mongoose.Schema({
        email: 
        {
            type:   String,
            required:   true,
        },
        picture:
        {
            type:   String,
            required:   true,
        },
        verified: 
        {
            type:   Boolean,
            required:   true,
        },
        name: 
        {
            type:   String,
            required:   true,
        },
        albums: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Album'
            }
        ]
    })
)


