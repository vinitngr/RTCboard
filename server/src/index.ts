import { app, server } from './lib/socket';
import express from 'express';
import path from 'path';
import connectDB from './lib/db';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import roomRoute from './routes/room.route';
import './sockets/rtc';

dotenv.config();

// CORS middleware BEFORE routes
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://rtcboard.vinitngr.xyz'],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);

// Serve static files (optional)
app.use(express.static(path.resolve(__dirname, '../public')));

// Start server
const port: number = Number(process.env.PORT) || 3001;
server.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
  connectDB();
});
