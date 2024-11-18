import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(process.env.REACT_APP_LEARNSPHERE_BASE_URL,{
    transports: ["websocket"], // Ensures WebSocket is used
    withCredentials: true, // Allows credentials if required
  }), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};