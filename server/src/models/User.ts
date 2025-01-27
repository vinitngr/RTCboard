import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  _id : mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
}

const userSchema  = new mongoose.Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>('User', userSchema);
export default User;
