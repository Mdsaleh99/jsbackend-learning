import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
// https://expressjs.com/en/5x/api.html#router

const router = Router()

router.route("/register").post(registerUser) // yaha jo .post() hai o http request hai.       yah control app.use("api/v1/users", userRouter)  userRouter se aaraha hai jaise hi /register hit hoga ye registerUser ko call karega hit nahi hua to nahi karega.



export default router