import crypto from 'crypto';
import client from '../lib/redis';
import { z } from 'zod';
import { rtc, userInRoom } from '../sockets/rtc';
import Room from '../models/Room';
export const createRoom = async (req: any, res: any) => {
    const { roomName, roomPassword, createdBy } = req.body;
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
        await client.set(`room:${id}`, JSON.stringify({ roomId: id, status: "Active", roomPassword, participants: [{ role: "creator", ...req.body.userDetails }], roomName }), "EX", 60 * 10);
        res.status(201).json({
            roomId: id,
            status: "Active",
            participants: [
                { role: "creator", ...req.body.userDetails }
            ],
            roomName
        });
    } catch (error: any) {
        res.status(401).json({ message: "Failed to create room" });
    }
}

export const joinRoom = async (req: any, res: any) => {
    const { roomId, roomPassword, userDetails } = req.body;
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
        if (!room) {
            return res.status(401).json({ message: "Room not found" });
        }
        const roomData = JSON.parse(room);

        roomData.participants.push({ role: "joiner", ...userDetails });

        if (roomData.status !== "Active") {
            return res.status(401).json({ message: "Room in Share / Room already Joined" });
        } else if (roomData.roomPassword !== roomPassword) {
            return res.status(401).json({ message: "Invalid room password" });
        } else {
            await client.set(`room:${roomId}`, JSON.stringify({ ...roomData, status: 'Joined' }), "EX", 60 * 30);

            const creator = roomData.participants[0].userId
            const creatorSocketId = userInRoom.get(creator)
            const currentUserSocketId = userInRoom.get(userDetails.userId)

            rtc.to(creatorSocketId).emit('userJoined', { ...roomData, status: 'Joined' })
            rtc.to(currentUserSocketId).emit('userJoined', { ...roomData, status: 'Joined' })
            res.status(200).json({
                roomId: roomId,
                status: "Joined",
                participants: roomData.participants,
                roomName: roomData.roomName,
            });
        }
    } catch (error: any) {
        res.status(401).json({ message: "Failed to join room" });
    }
}

export const exitRoom = async (req: any, res: any) => {
    const { roomId } = req.params;
    if (!roomId) {
        return res.status(400).json({ message: "RoomId required" })
    }
    try {
        const room = await client.get(`room:${roomId}`);
        if (room) {
            await client.del(`room:${roomId}`);
            rtc.to((JSON.parse(room).participants[0].userId)).emit('userExited', { userExited: true })
        }
        res.status(200).json({ message: "Room exited successfully" })
    } catch (error: any) {
        res.status(401).json({ message: "failed to Exit" })
    }
}

export const saveRoom = async (req: any, res: any) => {
    const { roomData } = req.body;

    const roomDataSchema = z.object({
        roomData: z.object({
            roomId: z.string().trim().min(6, "Room ID is required"),
            roomName: z.string().trim().min(1, "Room name is required"),
            roomCreated: z.coerce.date(),
            participants: z.array(
                z.object({
                    fullName: z.string().trim().min(1, "Participant name is required"),
                    role: z.enum(['creator', 'joiner'], {
                        errorMap: () => ({ message: 'Invalid role, only accept creator and joiner' })
                    }),
                    userId: z.string().length(24, { message: "Invalid userDetails ID" })
                })
            ).min(1, "At least one participant is required"),
            Data: z.object({
                canvasData: z.string().optional(),
                docsData: z.string().optional()
            })
        })
    });

    const validation = roomDataSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
    }

    try {
        const room = new Room(roomData);
        const successData = await room.save();
        res.status(200).json({ message: "Room saved successfully", successData })
    } catch (error: any) {
        res.status(401).json({ message: "failed to save room", error: error })
    }

}


export const getMeetings = async (req: any, res: any) => {
    try {
        let userId = res.locals.user._id
        if (!userId) return
        const meetings = await Room.find({ participants: { $elemMatch: { userId } } }).select('-Data -participants._id').sort({ roomCreated: -1 }).limit(10);
        res.status(200).json({ meetings })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getMeetingData = async (req: any, res: any) => {
    const { roomId } = req.params;
    let userId = res.locals.user._id
    try {
        console.log(roomId);
        const room = await Room.find({
                roomId,
                participants: { $elemMatch: { userId } }
            }).select('Data');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({ meetingData : room[0].Data })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}