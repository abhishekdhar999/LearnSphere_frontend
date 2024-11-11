import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export default function WebSocketComponent() {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]); // Store chat list
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for chat
  const [chatId, setChatId] = useState(null); // Store the selected chat's ID
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(''); // Message input
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("accessTokken");
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        setUserId(decodedToken._id); // Set userId from the token
        console.log("Logged in user ID:", decodedToken._id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch all chat data on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("accessTokken");
        const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/chat/fetchchat`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sending the token in the request headers
          },
        });

        setChats(response.data.data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages whenever a new user (chat) is selected
  useEffect(() => {
    const getMessages = async () => {
      if (!chatId) return;

      try {
        const token = localStorage.getItem("accessTokken");
        const response = await axios.get(
          `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/message/getMessages/${chatId}`, // Sending chatId as a URL param
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessages(response.data); // Set the messages for selected chat
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [chatId]);

  const handleUserClick = (chat) => {
    if (chat.user[1]._id !== selectedUser) {
      setSelectedUser(chat.user[1]._id);
      setChatId(chat._id); // Set chatId to fetch messages for that chat
      setMessages([]); // Clear messages while fetching new ones
    }
  };

  // Handle sending a new message (using WebSocket + API for redundancy)
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return; // Do nothing if message is empty

    try {
      const token = localStorage.getItem("accessTokken");

      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/message/sendmessages`,
        { chatId, content: newMessage }, // Sending chatId and message content
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Add the sent message to the local message list
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: { _id: userId }, content: newMessage }, // mimic server structure
        ]);
        setNewMessage(""); // Clear input after sending
      
        // Send the message via WebSocket as well
        if (socket && socket.readyState === WebSocket.OPEN) {
          const wsMessage = { chatId, sender: { _id: userId }, content: newMessage };
          socket.send(JSON.stringify(wsMessage)); // Send message via WebSocket
        }
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);
    setSocket(ws);

    // Listen for incoming messages from WebSocket
    ws.onmessage = (event) => {
      try {
        const receivedMessage = JSON.parse(event.data);
        console.log("Received WebSocket message:", receivedMessage);

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: receivedMessage.sender,
            content: receivedMessage.content,
          }
        ]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex h-[600px]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h3 className="text-lg font-semibold mb-4">Chats</h3>
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li
              key={chat.user[1]._id}
              onClick={() => handleUserClick(chat)}
              className={`cursor-pointer p-3 rounded-lg ${
                selectedUser === chat.user[1]._id
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              {chat.user[1]._id===userId ? chat.user[0].name : chat.user[1].name }
              
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-gray-200 border-b border-gray-300">
              <h3 className="text-lg font-semibold">
                {chats.find((chat) => chat.user[1]._id === selectedUser)?.user[1].name}
              </h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
  key={index}
  className={`my-2 p-3 rounded-lg w-max max-w-xs break-words ${
    (typeof msg.sender === 'string' ? msg.sender : msg.sender._id) === userId
      ? 'bg-green-200 self-end ml-auto text-right' // Sender's message (right)
      : 'bg-gray-200 self-start text-left' // Receiver's message (left)
  }`}
>
  <p className="text-sm">{msg.content}</p>
</div>

                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-300 flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <h3 className="text-lg font-semibold text-gray-500">
              Select a chat to start messaging
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}








// WebSocket Connection (mine code)
  // useEffect(() => {
  //   const ws = new WebSocket('ws://localhost:3001');
  //   setSocket(ws);

  //   // Listen for incoming messages from WebSocket
  //   ws.onmessage = (event) => {
  //     const receivedMessage = event.data;
  //     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
  //   };

  //   // Cleanup on component unmount
  //   return () => {
  //     ws.close();
  //   };
  // }, []);