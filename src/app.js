import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({  // https://www.npmjs.com/package/cors   iss link pe jaake aur information le sakte hai
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


// jab bhi middleware use karte hai to most of the time 'app.use()' ka use karte hai. yeh tab use karte hai jab hume middleware aur configration setting karni ho.

// yeh 3 major configration hai json, urlencoded, static
app.use(express.json({limit: "16kb"}))  // https://expressjs.com/en/5x/api.html#express.json   ....express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))  // https://expressjs.com/en/5x/api.html#express.urlencoded  ....express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());
app.use(express.static("public"))  // https://expressjs.com/en/5x/api.html#express.static 
// yeh 3 major configration end

app.use(cookieParser())




// routes import
import userRouter from './routes/user.routes.js';


// routes decleartion
app.use("/api/v1/users", userRouter)  // yah jaise hi /users pe url hit hota hai control userRouter ko pass hota hai handle karne k liye

export { app }


