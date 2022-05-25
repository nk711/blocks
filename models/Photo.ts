import mongoose from "mongoose";
import { User } from "./User";

export const Photo = mongoose.model(
    "Photo",  
    new mongoose.Schema({
        file_name: String,
        tags: [String],
        description: String,
        location: String,
        date: Date,
        hidden: Boolean,
        file_location: String
    })
)
