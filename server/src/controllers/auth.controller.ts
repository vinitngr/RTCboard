import User from "../models/User";
import { generateToken } from "../lib/utils";
import bcrypt from "bcrypt";
import { z } from "zod";
import mongoose from "mongoose";
import { loginUser, registerUser } from "../services/auth.service";


export const register = async (req: any, res: any) => {
  const { fullName, email, password } = req.body;

  const Schema = z.object({
    fullName: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email().regex(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/,
      "Invalid email domain. Only Gmail, Hotmail, Outlook, and Yahoo are allowed."
    ),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });

  const validation = Schema.safeParse({ fullName, email, password });
  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors });
  }

  try {
    const userData = await registerUser(fullName, email, password);
    const token = generateToken(userData._id , res);
    res.status(201).json({...userData , token});
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  const Schema = z.object({
    email: z.string().email().regex(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/,
      "Invalid email domain. Only Gmail, Hotmail, Outlook, and Yahoo are allowed."
    ),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });

  const validation = Schema.safeParse({ email, password });
  if (!validation.success) {
    return res.status(400).json({ message: validation.error.errors });
  }

  try {
    const userData = await loginUser(email, password);
    const token = generateToken(userData._id , res);
    res.status(200).json({...userData , token});
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logout = async (req : any , res : any) => {
  try{
    res.clearCookie("cookie");
    res.status(200).json({ message: "Logout successful" });
  }catch(error){
    console.log("Error while logging out", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req : any , res : any) => {
  try {
    res.status(200).json(res.locals.user);
  } catch (error) {   
    console.log("Error while checking auth", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




















// export const loginn = async (req: Request, res: Response) => {
//   res.sendFile("index.html", { root: path.join(__dirname, "../../public") });
// };

// export const registerr = async (req: Request, res: Response) => {
//   res.send("Register route");
// };

// export const logoutt = async (req: Request, res: Response) => {
//   const filePath = path.join(__dirname, "../../public/logout.html");
//   res.sendFile(filePath);
// };
