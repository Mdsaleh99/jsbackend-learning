import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

// req is client to server     and   res is server to client   and     req.body k andar saara data aata hai aur middleware req k andar aur zayada fields add karta hai

// req.body by default express ka hota hai,..   waise hi multer hamien req.files ka access deta hai  
const registerUser = asyncHandler(async (req, res) => {
    // get user details from forntend
    // validation - not empty 
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return res

    const {fullname, email, username, password, } = req.body
    console.log("email: ", email)

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are requried")
    }


    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path   // ye tarika hai multer se lene ka,  aur ye abhi server par hai cloudinary pe upload nhi gaya hai 
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is requried")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath) 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is requried")
    }

    // database entry . user database se baat karra hai idher
    const user = await User.create({   // create method hai aur object leta hai
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    // checking user bana hai ya nhi .. ye database call hai
    const createdUser = await User.findById(user._id).select("-password -refreshToken")  // mongoDB by default _id create karta hai aur ye hamien help karega check karne k liye user bana hai ya nhi     and     select ek method hai isme pass hota hai string aur isme likte hai kya kya nhi chahiye...   aur minus(-) sign lagado jo field nhi chahiye 

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // returning the response
    return res.status(201).json(   
        new ApiResponse(200, createdUser, "User registered successfully")   // new jo hai object banayega ApiResponse ka 
    )

})


export { registerUser }



