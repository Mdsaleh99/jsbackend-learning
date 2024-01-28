import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
// https://expressjs.com/en/5x/api.html#router

const router = Router()


// yaha jo .post() hai o http request hai.       
router.route("/register").post(
    upload.fields([  // ye middelware hai
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),

    registerUser) // yah control app.use("api/v1/users", userRouter)  userRouter se aaraha hai jaise hi /register hit hoga ye registerUser ko call karega hit nahi hua to nahi karega.


router.route("/login").post(loginUser)


// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router