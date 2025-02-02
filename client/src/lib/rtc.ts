    import { Socket } from "socket.io-client";

    const configuration = {
        'iceServers': [
            {'urls': 'stun:stun.l.google.com:19302'}
        ]
    }
    export const peerConnection : RTCPeerConnection = new RTCPeerConnection(configuration);
    export const dataChannel: RTCDataChannel = peerConnection.createDataChannel('chat');
    
    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state changed = ', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed') {
            console.log('ICE connection established');
        }
    };

    // dataChannel.onmessage = ({ data }) => {
    //     console.log('Received message:', data);
    // }

    // dataChannel.onopen = () => {
    //     console.log('Data Channel Open:', dataChannel.readyState);
    //     if (dataChannel.readyState === 'open') {
    //         dataChannel.send('hi');
    //     }
    // };
    peerConnection.onnegotiationneeded = async () => {
            console.log('nego needed');
    }
    
    
    export const makeCall = async (socket: Socket, creatorId: string) => {
        try {
            const offer = await peerConnection.createOffer();
            peerConnection.onicecandidate =  (event) => {
                if (event.candidate && peerConnection.iceConnectionState !== 'connected' && peerConnection.iceConnectionState !== 'completed') {
                    socket.emit('new-ice-candidate', { ice: event.candidate, id: creatorId });
                }
            };
            return offer;
        } catch (error) {
            console.warn('Error during makeCall:', error);
        }
    };

    export const RTCcreateAnswer = async (socket : Socket , joinerId : string | undefined) =>{
        try {
            const answer = await peerConnection.createAnswer();

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && peerConnection.iceConnectionState !== 'connected' && peerConnection.iceConnectionState !== 'completed') {
                    socket.emit('new-ice-candidate', { ice: event.candidate, id: joinerId });
                }
            };
            return answer
        }
        catch(error){
            console.warn('Error during RTCcreateAnswer:', error);
        }
    }