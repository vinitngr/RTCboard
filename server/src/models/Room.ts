import mongoose, { Document, Schema } from 'mongoose';

interface IRoom extends Document {
    roomName : string;
    roomId : string;
    roomCreated : string;
    participants: { fullName : string  , role : 'joiner' | 'creater ' , userId : Schema.Types.ObjectId}[];
    Data : {
        canvasData : String ,
        docsData : String
    }
}

const roomSchema  = new mongoose.Schema<IRoom>({
    roomName : { type : String , required : true },
    roomId : { type : String , required : true , unique : true },
    roomCreated : { type : String , required : true },
    participants: {
        type: [
          {
            fullName : { type: String , required : true },
            role: { type: String, enum: ['joiner', 'creator'], required: true },
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          },
        ],
        required: true
      },
    Data: {
        type: {
          canvasData: { type: String },
          docsData: { type: String }
        },
        required: true
      }
  },
  { timestamps: true }
);


const Room = mongoose.model<IRoom>('Room', roomSchema);
export default Room;
