import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

const userSchema  = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>('User', userSchema);
export default User;
