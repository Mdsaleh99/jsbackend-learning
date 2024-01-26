import mongoose, { Schema } from "mongoose";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true   // searching field enable karna hai to index true karna padega aur ye index amazing topic hai
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname:{
            type: String,
            required: true,
            index: true,
            trim: true
        },
        avtar:{
            type: String,   // cloudnary url
            required: true,    
        },
        coverImage:{
            type: String,   // cloudnary url    
        },
        watchHistory: [
           {
                type: Schema.Types.ObjectId,
                ref: "Video"
           }
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        
    },
    { timestamps: true }
)

// pre save middleware and pre ek hook hai jo mongoose provide karta hai      https://mongoosejs.com/docs/7.x/docs/middleware.html#pre     pre hook me hume 2 parameter milte hai 1st parameter me hume ek string pass karna padega yani event pass karna hai (save ek event hai) aur 2nd parameter me hume ek function pass karna padega aur yah pe hume ek callback function pass karna padega lekin arrow function call back function nahi pass kar sakte hai kyu ki arrow function me this keyword ka use nahi kar sakte hai isliye hume normal function pass karna padega..... yah function async function hona chahiye kyu ki hume yah function async function banana padega kyu ki hume yah function me password ko hash karna hai aur password ko hash karne ke liye hume time lagta hai aur yah time hume async function me mil jayega....     next function ko hume call karna padega kyu ki yah next function hume next middleware ko call karne me help karega
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()  // isModified ek mongoose method hai aur yah method hume yah batata hai ki password field me kuch change hua hai ya nahi
    
    this.password = await bcrypt.hash(this.password, 10)  //10 is the salt round and salt round is the number of time the password is hashed 
    next()
} )

// custom hooks b bana sakte hai mongoose me 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // expiry ko object me pass karna padega
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // expiry ko object me pass karna padega
        }
    )
}

// jwt ek bearer token hai 


export const User = mongoose.model("User", userSchema)