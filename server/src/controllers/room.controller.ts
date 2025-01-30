import crypto from 'crypto';
import client from '../lib/redis';
import { z } from 'zod';
export const createRoom = async (req: any, res: any) => {
    const { roomName , roomPassword , createdBy } = req.body;
    const createRoomSchema = z.object({
        roomName: z.string().min(1, { message: "Room name is required" }),
        roomPassword: z.string().min(1, { message: "Room password is required" }),
        userDetails: z.object({ fullName: z.string(), userId: z.string() }),
    });
    const validation = createRoomSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
    }

    const id = crypto.randomBytes(6).toString('hex')
    try {
        await client.set(`room:${id}`, JSON.stringify({ roomId : id , status : "Active" , roomPassword , participants : [{ role : "creator" , ...req.body.userDetails }] , roomName }) ,  "EX", 60*10 );
        res.status(201).json({ 
            roomId : id ,
            status : "Active" ,
            participants : [
                { role : "creator" , ...req.body.userDetails }
            ] , 
            roomName
        });
    } catch (error: any) {
        res.status(401).json({ message: "Failed to create room" });
    }
}

export const joinRoom = async (req: any, res: any) => {
    const { roomId , roomPassword , userDetails } = req.body;
    const joinRoomSchema = z.object({
        roomId: z.string().min(1, { message: "RoomID required" }),
        roomPassword: z.string().min(1, { message: "Room password required" }),
        userDetails: z.object({ fullName: z.string(), userId: z.string() }),
    });
    try {
        const validation = joinRoomSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: validation.error.errors[0].message });
        }
        const room = await client.get(`room:${roomId}`);
        if(!room) {
            return res.status(401).json({ message: "Room not found" });
        }
        const roomData = JSON.parse(room);

        roomData.participants.push({role : "joiner" , ...userDetails });
        // if (roomData.status !== "Active") {
        if (roomData.participants.length > 2) {
            return res.status(401).json({ message: "Room in Share"});
        } else if (roomData.roomPassword !== roomPassword) {
            return res.status(401).json({ message: "Invalid room password" });
        } else {
            await client.set(`room:${roomId}`, JSON.stringify({ ...roomData, status: 'Joined' }), "EX", 60 * 10);
            res.status(200).json({
                roomId: roomId,
                status: "Joined",
                participants: roomData.participants,
                roomName: roomData.roomName,
            });
        }
    } catch (error : any) {
        res.status(401).json({ message: "Failed to join room" });
    }
}

export const exitRoom = async (req: any, res: any) => {
    const { roomId } = req.params;
    if(!roomId){
        return res.status(400).json({message : "RoomId required"})
    }
    try {
        const findRoom = await client.get(`room:${roomId}`);
        if(!findRoom) {
            return res.status(401).json({ message : "Room does not exist"})
        }
        const room = await client.del(`room:${roomId}`);
        res.status(200).json({ message : `Room exited successfully`})
    } catch (error : any) {
        res.status(401).json({ message : "failed to Exit"})
    }
}