import User from "../models/User";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string, fullName: string) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      return { error: "User not created" };
    }

    return savedUser; 
  } catch (error) {
    console.error("Error while creating user:", error.message);
    return { error: "Internal server error" };
  }
};
