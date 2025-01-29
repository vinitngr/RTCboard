import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const generateToken = (
      userId: mongoose.Schema.Types.ObjectId , res : any ): string => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
      });
      
      res.cookie("cookie", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        sameSite: "strict", 
        secure: process.env.NODE_ENV !== "development",
      });


  return token;
};
