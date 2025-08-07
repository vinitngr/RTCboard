import { app, server } from './lib/socket';
import express from 'express';
import path from 'path';
import connectDB from './lib/db';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === 'production'
//         ? [process.env.URL]
//         : 'http://localhost:5173',
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ['http://localhost:5173' , "https://rtcboard.vinitngr.xyz"],
    credentials: true,
  })
);


// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
import authRoute from './routes/auth.route';
import roomRoute from './routes/room.route';
import './sockets/rtc';

app.use('/api/auth', authRoute);
app.use('/api/room', roomRoute);

//production serve
// if (process.env.NODE_ENV === 'production') {
//   const Path = path.resolve(__dirname, '../../client/dist');
//   app.use(express.static(Path));

//   app.get('*', (req, res) => {
//     res.sendFile(path.join( Path, 'index.html'));
//   });
// }
// Static files serve
app.use(express.static(path.resolve(__dirname, '../public')));

// Start the server
const port: number = Number(process.env.PORT) || 3001;
server.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
  connectDB();
});
