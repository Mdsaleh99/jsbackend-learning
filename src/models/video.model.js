import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile: {
            type: String,  // cloudnary url
            required: true
        },
        thumbnail: {
            type: String,  // cloudnary url
            required: true
        },
        title: {
            type: String,
            required: true
        },
        discription: {
            type: String,
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
          type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true }
)

videoSchema.plugin(mongooseAggregatePaginate)  // https://www.npmjs.com/package/mongoose-aggregate-paginate-v2 and mongoose option deta hai own plugin add karne ka o hai 'plugin'
export const Video = mongoose.model("Video", videoSchema)

// bcrypt is a password hashing function and it is used to hash the password
// JWT is a JSON Web Token and it is used to create a token for the user  https://jwt.io/