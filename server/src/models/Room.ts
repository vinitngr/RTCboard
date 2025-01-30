import mongoose, { Document, Schema } from 'mongoose';

interface IRoom extends Document {
    roomName : string;
    roomId : string;
    roomCreated : Date;
    createdBy : Schema.Types.ObjectId;
    participants: { role : string , userDetails: Schema.Types.ObjectId }[];
    canvasData : { canvasId : string , canvasData : string }[]
}

const roomSchema  = new mongoose.Schema<IRoom>({
    roomName : { type : String , required : true },
    roomId : { type : String , required : true },
    roomCreated : { type : Date , required : true },
    createdBy : { type : Schema.Types.ObjectId , required : true },
    participants: [{
        role : String ,   
        userDetails: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        required: true
    }], 
    canvasData : [{
        canvasId : { type : String , required : true },
        canvasData : { type : String , required : true }
    }]
  },
  { timestamps: true }
);


const Room = mongoose.model<IRoom>('Room', roomSchema);
export default Room;
