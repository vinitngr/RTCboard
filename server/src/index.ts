import { app , server } from './lib/socket';
import express from 'express'
import path from 'path'
import connectDB from './lib/db';

//dotenv setup
import dotenv from 'dotenv';
dotenv.config();

//routes
import authRoute from './routes/auth.route';

//socket
import './sockets/rtc'

// Application Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//handle routes here
app.use('/api/auth', authRoute);

//server startup
let port : number = parseInt(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB()
});