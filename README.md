# Real-time WebRTC Collaboration

This is a real-time collaboration platform built with **WebRTC, Node.js, React, Redis, and Socket.io**. It enables users to create and join rooms, establish peer-to-peer (P2P) connections, and collaborate on a shared canvas.

## Features
- **Room Management:** Rooms are created and stored in **Redis**, allowing users to join existing sessions.
- **Peer-to-Peer Communication:** WebRTC enables direct **video and audio streaming** between participants.
- **Real-time Canvas Collaboration:** Users can draw and interact on a shared canvas.
- **Socket.io Signaling:** Manages real-time communication for room events and peer connections.
- **Scalable Architecture:** Redis ensures efficient room tracking and session management.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Real-time Communication:** WebRTC, Socket.io
- **Data Storage:** Redis , mongoDB

## Installation
### Prerequisites
Ensure you have **Node.js**, **npm**, and **Redis** installed.

### Setup
#### 1. Clone the repository:
```sh
git clone https://github.com/vinitngr/RTCboard.git
cd RTCboard
```

#### 2. Install dependencies:
##### Backend:
```sh
cd server
npm install
```
##### Frontend:
```sh
cd client
npm install
```

#### 3. Start the application:
##### Start Redis:
```sh
redis-server | sudo systemctl start redis-server
```
##### Run backend:
```sh
cd server
npm run dev
```
##### Run frontend:
```sh
cd client
npm run dev
```

## Usage
1. Open the application in the browser.
2. Create a new room or join an existing one using roomId and password.
3. share room id and password to joiner 
4. Connect with peers for video/audio communication.
5. Collaborate on the shared canvas in real time.
