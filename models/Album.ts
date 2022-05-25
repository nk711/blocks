import mongoose from "mongoose";

export const Album = mongoose.model(
    "Album",  
    new mongoose.Schema({
        title: String,
        description: String,
        created_by: Date,
        count: String,
        date_range: String,
        photos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Photo'
            }
        ]
    })
)