import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  _id : mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profilepic: string;
}

const userSchema  = new mongoose.Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilepic : { type: String , default: "https://avatars.githubusercontent.com/u/77173543?v=4"},
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>('User', userSchema);
export default User;
