import React, { useEffect, useRef, useState } from 'react';

const VideoCall = ({ community }) => {
  const [participants, setParticipants] = useState([]); // List of other participants
  const [incomingCall, setIncomingCall] = useState(null); // Store the incoming call information
  const [callStatus, setCallStatus] = useState(''); // Status: "Idle", "Calling", "In Call", "Connecting"
  const ws = useRef(null); // WebSocket connection
  const localStreamRef = useRef(null); // Local video stream
  const peerConnections = useRef({}); // Object to store RTCPeerConnection per participant
  const peerConnectionRef = useRef(null);
  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({
          type: 'join-room',
          communityId: community.groupChatId,
        })
      );
    };

    // Handle incoming WebSocket messages
    ws.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      console.log("message i vide call",message)
      if (message.type === 'new-participant') {
        startVideoCall(message.communityId);
      }

      if (message.type === 'video-offer') {
        // Set incoming call information and show notification
        setIncomingCall(message);
        setCallStatus('Incoming Call');
      }

      if (message.type === 'video-answer') {
        handleVideoAnswer(message);
        setCallStatus('In Call'); // Update status when the call is answered
      }

      if (message.type === 'new-ice-candidate') {
        handleNewIceCandidate(message);
      }
    };

    return () => {
      ws.current.close();
    };
  }, [community.groupChatId]);

  const handleVideoOffer = async (message) => {
    const peerConnection = createPeerConnection(message.communityId);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    ws.current.send(
      JSON.stringify({
        type: 'video-answer',
        communityId: message.communityId,
        sdp: peerConnection.localDescription,
      })
    );
  };

  const handleVideoAnswer = async (message) => {
    const peerConnection = peerConnections.current[message.communityId];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
  };

  const handleNewIceCandidate = async (message) => {
    const peerConnection = peerConnections.current[message.communityId];
    await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
  };

  const createPeerConnection = (communityId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnections.current[communityId] = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(
          JSON.stringify({
            type: 'new-ice-candidate',
            candidate: event.candidate,
            communityId,
          })
        );
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById(`remoteVideo_${communityId}`);
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    return peerConnection;
  };

  const startVideoCall = async () => {
    try {
      setCallStatus('Calling'); // Update status to "Calling"

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current.srcObject = localStream;
  
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
  
      peerConnectionRef.current = peerConnection;
  
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          ws.current.send(
            JSON.stringify({
              type: 'new-ice-candidate',
              candidate: event.candidate,
              communityId: community.groupChatId,
            })
          );
        }
      };
  
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
  
      ws.current.send(
        JSON.stringify({
          type: 'video-offer',
          communityId: community.groupChatId,
          sdp: peerConnection.localDescription,
        })
      );
    } catch (error) {
      console.error('Error starting video call:', error);
    }
  };

  const acceptIncomingCall = async () => {
    handleVideoOffer(incomingCall); // Accept the incoming call by handling the offer
    setIncomingCall(null); // Clear the incoming call notification
    setCallStatus('Connecting');
  };

  const declineIncomingCall = () => {
    setIncomingCall(null); // Clear the incoming call notification without accepting
    setCallStatus('Idle');
  };

  return (
    <div>
      <h2>Video Call for Community {community.groupChatId}</h2>
      {callStatus && <h3>Status: {callStatus}</h3>}
      <video ref={localStreamRef} autoPlay playsInline></video>

      {participants.map((participantId) => (
        <video key={participantId} id={`remoteVideo_${participantId}`} autoPlay playsInline></video>
      ))}

      {incomingCall && (
        <div>
          <p>Incoming call from {incomingCall.sender}</p>
          <button onClick={acceptIncomingCall}>Accept</button>
          <button onClick={declineIncomingCall}>Decline</button>
        </div>
      )}

      <button onClick={startVideoCall}>Start Video Call</button>
    </div>
  );
};

export default VideoCall;


