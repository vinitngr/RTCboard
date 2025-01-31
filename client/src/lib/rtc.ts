    import { Socket } from "socket.io-client";

    const configuration = {
        'iceServers': [
            {'urls': 'stun:stun.l.google.com:19302'}
        ]
    }
    export const peerConnection = new RTCPeerConnection(configuration);
    export const dc = peerConnection.createDataChannel('chat');


    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state changed = ', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed') {
            console.log('ICE connection established');
        }
    };
    
    peerConnection.ondatachannel = (event) => {
        const channel = event.channel;
        channel.onmessage = ({ data }) => {
            console.log('Received message:', data);
        };
        channel.onopen = () => console.log('Data channel opened');
        channel.onclose = () => console.log('Data channel closed');
    };
    dc.onmessage = ({ data }) => {
        console.log('Received message:', data);
    }

    dc.onopen = () => {
        console.log('Data Channel Open:', dc.readyState);
        if (dc.readyState === 'open') {
            dc.send('hi');
        }
    };
    
    export const makeCall = async (socket: Socket, creatorId: string) => {
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            peerConnection.onicecandidate =  (event) => {
                if (event.candidate && peerConnection.iceConnectionState !== 'connected' && peerConnection.iceConnectionState !== 'completed') {
                    socket.emit('new-ice-candidate', { ice: event.candidate, id: creatorId });
                }
            };
            

            socket.emit('RTCoffer', { offer, creatorId });
        } catch (error) {
            console.warn('Error during makeCall:', error);
        }
    };

    export const RTCcreateAnswer = async (offer : RTCSessionDescription , socket: Socket , joinerId : string | undefined) =>{
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit('RTCanswer' , {answer , joinerId : joinerId});

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && peerConnection.iceConnectionState !== 'connected' && peerConnection.iceConnectionState !== 'completed') {
                    socket.emit('new-ice-candidate', { ice: event.candidate, id: joinerId });
                }
            };}
        catch(error){
            console.warn('Error during RTCcreateAnswer:', error);
        }
    }