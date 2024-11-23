import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const socket = useSocket();

  console.log("socket",socket)
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
    //   setLoading(true);
    console.log("in")
    console.log("emai",email,room)
      socket.emit("room:join", { email, room });
    },
    
    [email, room, socket]
    
  );

  const handleJoinRoom = useCallback(
   
    (data) => {
        console.log("in handleJoinRoom ")
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    console.log()
    socket.on("room:join", handleJoinRoom);

    return () => {

      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <>
    <div className="flex my-6 text-white text text-2xl font-medium justify-center">
    <h1>To Check the video App working login with another id & join the same room</h1>
    </div>
    <div className="bg-white p-8 rounded shadow-md max-w-md mx-auto mt-10">
        
    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Lobby</h1>
    
    <form onSubmit={handleSubmitForm}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email ID
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="room" className="block text-gray-700 font-medium mb-2">
          Room Number
        </label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
          email && room ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
        // disabled={!email || !room || loading}
      >
        join
      </button>
    </form>
  </div>
  </>
  );
};

export default LobbyScreen;