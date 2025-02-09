import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import {config} from 'dotenv'

config()
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: process.env.URL as string ,
    },
  });

export { io, app, server };

