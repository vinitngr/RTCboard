import { app , server } from './lib/socket';
import express from 'express'
import path from 'path'
import connectDB from './lib/db';
//cors
import cors from 'cors';
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.URL : 'http://localhost:5173',
    credentials: true,
  })
);
//dotenv setup
import dotenv from 'dotenv';
dotenv.config();

//cookie
import cookieParser from 'cookie-parser';
app.use(cookieParser());
//routes
import authRoute from './routes/auth.route';
import roomRoute from './routes/room.route';
//socket
import './sockets/rtc'

// Application Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//handle routes here
app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);

//server startup
let port : number = parseInt(process.env.PORT) || 3001;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB()
});