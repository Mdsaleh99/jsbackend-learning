//require('dotenv').config({path: './.env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";


dotenv.config({
    path: "./.env"
})


// this 2nd approach is recommended

connectDB()
.then(() => {   // 2 isme app ka use karke server ko listen karwa rahe hai matlab server ko start kar rahe hai
    app.on("Error", (error) => { // ye app.listen ke andar nahi hai kyuki agar error aata hai toh server start nahi hoga.. yah event k liye listen kar rahe hai error
        console.log("Error: ", error);
        throw error
       })

    app.listen(process.env.PORT || 8000, () => {  //2
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("MONGO db connection failed !!! ", err);
})


















/*       this is 1st apporach not recommended 

import express from "express";
const app = express();
(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("Error", (error) => {
        console.log("Error: ", error);
        throw error
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
       })
    } catch (error) {
        console.error("Error: ", error);
        throw err
    }
})()
*/