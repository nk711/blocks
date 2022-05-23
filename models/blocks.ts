import mongoose from "mongoose";

export const Blocks = mongoose.model(
    "Blocks",
    new mongoose.Schema({
        file_name: String,
        tags: [String],
        description: String,
        location: String,
        date: Date,
        classed: [String],
        file_location: String
    })
)


