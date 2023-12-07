//require('dotenv').config({path: './.env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path: "./.env"
})


// this 2nd approach is recommended

connectDB()

























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