import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.MONGO_URI);
export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);    
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
    }
}