import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"



// req is client to server     and   res is server to client   and     req.body k andar saara data aata hai aur middleware req k andar aur zayada fields add karta hai

// req.body by default express ka hota hai...   waise hi multer hamien req.files ka access deta hai  
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

    const {fullname, email, username, password } = req.body
    // console.log("email: ", email)

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are requried")
    }


    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path  // ye tarika hai multer se lene ka,  aur ye abhi server par hai cloudinary pe upload nhi gaya hai 
    // let avatarLocalPath;
    // if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    //     avatarLocalPath = req.files.avatar[0].path
    // }


    // const coverImageLocalPath = req.files?.coverImage[0]?.path  // this will give an error
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is requried")
    }
    console.log(req.files);
    console.log(req.body);
    

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


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false }) // yaha save karte waqt validation mat karo isliye false kiya hai

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}



const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie



    const {username, email, password} = req.body
    console.log(email)

    if (!username && !email) {  // this is for when user not entered any data
        throw new ApiError(400, "username or email is requried")
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
    // }



    const user = await User.findOne({   // this is for when user entered data and this method will check in mongoDB
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user crendentials")
    }


    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)  // is generateAccessAndRefreshToken method se wapis accessToken aur refreshToken milra hai


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken 
            },
            "User logged in successfully"
        )
    )



})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out"))

   



})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    
    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodeToken?._id)
        
        if(!user){
            throw new ApiError(401, "Unvalid refresh token")
        }
        
        if (incomingRefreshToken != user?.refreshToken) {
            throw new ApiError(401, "Refresh token expried or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed")
        )
    } 
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

    
})


const changeCurrnetPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(200, req.user, "Current user fetched successfully")
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullname, email} = req.body

    if(!fullname || !email){
        throw new ApiError(400, "All fields are requried")
    }

    const user = User.findByIdAndUpdate(
        req.body._id,
        {
            $set: {
                fullname,
                email
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Account details update successfully"))
})


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.body._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Avatar image is updated successfully"))
})


const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading coverImage on cloudinary")
    }

    await User.findByIdAndUpdate(
        req.body._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Cover image is updated successfully"))
})













export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrnetPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}



