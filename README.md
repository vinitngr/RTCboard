# Real-time WebRTC Collaboration  

This is a real-time collaboration platform built with **WebRTC, Node.js, React, Redis, and Socket.io**. It enables users to create and join rooms, establish peer-to-peer (P2P) connections, and collaborate on a shared canvas.  

## Features  
- **Room Management:** Rooms are created and stored in **Redis**, allowing users to join existing sessions.  
- **Peer-to-Peer Communication:** WebRTC enables direct **video and audio streaming** between participants.  
- **Real-time Canvas Collaboration:** Users can draw and interact on a shared canvas (excalidraw board).  
- **Socket.io Signaling:** Manages real-time communication for room events and peer connections.  
- **Scalable Architecture:** Redis ensures efficient room tracking and session management.  
- **Secure Access:** Authentication ensures only authorized users can join rooms.  
- **User-Friendly Interface:** A clean, modern frontend enhances the collaboration experience.  

## Room Page  
After joining a room, users can see video streams and collaborate on a canvas.  

![Room Page](https://res.cloudinary.com/dqu1cpasg/image/upload/v1739131359/Screenshot_2025-02-10_013210_agriws.png)

## Home Page  

![Home Page](https://res.cloudinary.com/dqu1cpasg/image/upload/v1739131368/Screenshot_2025-02-10_013047_bjop8q.png)


## Tech Stack  
- **Frontend:** React.js, zustand (leveraging **Bolt.new** for UI efficiency with custom styling)
- **Backend:** Node.js, Express  
- **Real-time Communication:** WebRTC, Socket.io  
- **Data Storage:** Redis, MongoDB  

## Installation  

### Prerequisites  
Ensure you have **Node.js, npm, and Redis** installed. You can also use online Redis services like **Upstash** instead of running a local Redis server. If you are using Windows, consider setting up **WSL (Windows Subsystem for Linux)** for better compatibility.  

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
redis-server   
# or  
sudo systemctl start redis-server # background  
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
1. Signup using email and password
2. Open the application in the browser.  
3. Create a new room or join an existing one using **Room ID** and **password**.  
4. Share the **Room ID** and **password** with participants.  
5. Connect with peers for video/audio communication.  
6. Collaborate on the shared canvas in real time.
