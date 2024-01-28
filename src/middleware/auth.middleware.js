import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// ye middleware check karega ki user hai ya nhi and ye custom middleware hai khud ka banaya hua



export const verifyJWT = asyncHandler(async (req, _, next) => {  // idhar res ka use nhi tha isliye underscore(_) laga diya aisa production level code pe hota hai
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")   // Authorization k baare me padna aur header k baare me bhi padna complusary hai     https://jwt.io/introduction
    
        console.log(token);
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    
        if (!user) {
            // TODO: discuss about frontend
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user
        next()
    } 
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})