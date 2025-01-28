import User from "../models/User";
import { generateToken } from "../lib/utils";
import bcrypt from "bcrypt";
import { z } from "zod";
import mongoose from "mongoose";


export const register = async (req : any , res : any) => {
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
  if(!validation.success){
    return res.status(400).json({ message: validation.error.errors});
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = bcrypt.hashSync(password, 12);  // Sync hash
    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      console.log("User not created");
      return res.status(500).json({ message: "User not created" });
    }
    try {
      const token = generateToken(savedUser._id, res);
      console.log('Token generated:', token);

      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        token: token,
      });

      console.log('5: Response sent');
    } catch (error) {
      console.log('Error generating token:', error.message);
      return res.status(500).json({ message: "Error generating token" });
    }
  } catch (error) {
    console.log("Error while registering user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async ( req : any , res : any ) => {
  const { email, password } = req.body;

  const Schema = z.object({
    email: z.string().email().regex(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/,
      "Invalid email domain. Only Gmail, Hotmail, Outlook, and Yahoo are allowed."
    ),
    password: z.string().min(6 , { message: "Password must be at least 6 characters long" }),
  });

  const validation = Schema.safeParse({ email, password });
  if(!validation.success){
    return res.status(400).json({ message: validation.error.errors});
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token :  token 
    });
  } catch (error) {
    if(error instanceof mongoose.Error.ValidationError){
      console.log('validation');
    }
    console.log("Error while loggin in", error.message);
    res.status(500).json({ message: "Internal Server Error" });
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
