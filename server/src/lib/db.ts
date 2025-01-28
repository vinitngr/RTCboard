import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);    
        console.log(process.env.MONGO_URI);
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
    }
}