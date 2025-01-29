import express from 'express';
import { createRoom, exitRoom, joinRoom } from '../controllers/room.controller';
import { protectedRoutes } from '../middleware/protectedRoutes';

const router = express.Router();

router.post('/create-room' , protectedRoutes , createRoom )
router.post('/join-room' , protectedRoutes , joinRoom )
router.delete('/exit-room', protectedRoutes , exitRoom )

export default router;