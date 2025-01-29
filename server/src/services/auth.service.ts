import bcrypt from 'bcrypt';
import User from '../models/User';

export const registerUser = async (fullName: string, email: string, password: string) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const hashPassword = bcrypt.hashSync(password, 12);

  const newUser = new User({
    fullName,
    email,
    password: hashPassword
  });

  const savedUser = await newUser.save();
  if (!savedUser) {
    throw new Error("User not created");
  }

  return {
    _id: savedUser._id,
    fullName: savedUser.fullName,
    email: savedUser.email,
    profilepic: savedUser.profilepic,
  };
};


export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilepic: user.profilepic,
  };
};