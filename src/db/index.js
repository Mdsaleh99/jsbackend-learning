import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// database connection
const connectDB = async () => {  // async function jab bhi compelete hota hai toh technically promise return karta hai
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB