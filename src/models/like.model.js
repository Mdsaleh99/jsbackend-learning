import mongoose, { Schema, trusted } from "mongoose";


const likeSchema = new Schema(
    {
        viedo: {
            type: mongoose.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: mongoose.Types.ObjectId,
            ref: "Tweet"
        },
        likedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }

    },
    {timestamps: true}
)


export const Like = mongoose.model("Like", likeSchema)