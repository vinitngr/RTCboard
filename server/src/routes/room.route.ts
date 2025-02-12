import express from 'express';
import { createRoom, exitRoom, getMeetings, joinRoom, saveRoom } from '../controllers/room.controller';
import { protectedRoutes } from '../middleware/protectedRoutes';

const router = express.Router();

router.post('/create-room' , protectedRoutes , createRoom )
router.post('/join-room' , protectedRoutes , joinRoom )
router.delete('/exit-room/:roomId', protectedRoutes , exitRoom )
router.post('/save-room' , protectedRoutes , saveRoom )
router.get('/get-meetings' , protectedRoutes , getMeetings )

export default router;