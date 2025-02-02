
export const PeerConnection = () => {
    let connection: { peerConnection: RTCPeerConnection; dataChannel: RTCDataChannel } | null = null;

    const createPeerConnection = () => {
        const configuration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

        const peerConnection = new RTCPeerConnection(configuration);
        const dataChannel = peerConnection.createDataChannel("chat");

        connection = { peerConnection, dataChannel };
        return connection;
    };

    return {
        getInstance: () => {
            if (!connection) {
                connection = createPeerConnection();
            }
            return connection;
        },
    };
};