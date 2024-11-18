import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { AiTwotoneMessage } from "react-icons/ai";
import { useSocket } from '../Context/SocketProvider';
export default function WebSocketComponent() {
  const socket = useSocket()
  // const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]); // Store chat list
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for chat
  const [chatId, setChatId] = useState(null); // Store the selected chat's ID
  const [messages, setMessages] = useState([]); // Store chat messages
  const [newMessage, setNewMessage] = useState(''); // Message input
  const [userId, setUserId] = useState('');
  const [chatUser,setChatUser] = useState()
const[notify,setNotify] = useState(false)
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

  useEffect(()=>{
    
  })
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
  }, [selectedUser]);



  const handleUserClick = (chat) => {
 console.log("selected ",selectedUser)
    if (chat.user[0]._id !== selectedUser) {
     
      setSelectedUser(chat.user[0]?._id);
      setChatId(chat._id); // Set chatId to fetch messages for that chat
      setMessages([]); // Clear messages while fetching new ones
      setNotify(false)
    }
    
  };

  // find user by selected user id 
  // useEffect(()=>{
  //   console.log("selece",selectedUser)
  //   const findUser = async (id) => {
  //     console.log("id",id)
  //     try {
  //       const token = localStorage.getItem("accessTokken");
  //       const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/finduser/${id}`
  //       , {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Sending the token in the request headers
  //           },
  //           });
  //           console.log("sele",response.data);
  //           setChatUser(response.data);
  //           } catch (error) {
  //             console.error("Error fetching user:", error);
  //             }
  //             };

  //         findUser(selectedUser);
  // },[selectedUser ,handleUserClick])

  // Fetch messages whenever a new user (chat) is selected
  useEffect(() => {
    const getMessages = async () => {
      console.log("in get messgae")
      if (!chatId) return;
console.log("chatid",)
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
  }, [chatId,selectedUser]);

  

  // Handle sending a new message (using WebSocket + API for redundancy)
  const handleSendMessage = async () => {
    console.log("selected user",selectedUser)
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
        const wsMessage = { chatId, sender: { _id: userId }, content: newMessage,reciever:{_id:selectedUser} };
        // socket.emit('sendMessage', wsMessage);
        socket.emit("sendMessage",JSON.stringify(wsMessage));
        // Send the message via WebSocket as well
        // if (socket && socket.readyState === WebSocket.OPEN) {
        //   
        //   socket.send(JSON.stringify(wsMessage)); // Send message via WebSocket
        // }
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };
// for recieving message
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {

      console.log("new message", newMessage);
      const receivedMessage = JSON.parse(newMessage);
      setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    sender: receivedMessage.sender,
                    content: receivedMessage.content,
        
                  }
                ]);
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('receiveMessage');
    };
//     const ws = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);
//     setSocket(ws);

//     // Listen for incoming messages from WebSocket
//     ws.onmessage = (event) => {
//       try {
//         const receivedMessage = JSON.parse(event.data);
//         console.log("Received WebSocket message:", receivedMessage);

//         if (receivedMessage.receiver === userId) {
//           // Trigger notification
//           console.log("match")
// setNotify(true);
//           displayNotification(receivedMessage.content);
//         }else{
//           console.log("no match")
//         }

//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             sender: receivedMessage.sender,
//             content: receivedMessage.content,

//           }
//         ]);
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };

//     return () => {
//       ws.close();
//     };
  }, []);

  const displayNotification = (messageContent) => {
    console.log("in displayNotification")
    if (Notification.permission === "granted") {
      new Notification("New Message", {
        body: messageContent,
        icon: '/rb_7965.png'
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Message", {
            body: messageContent,
            icon: '/rb_7965.png'
          });
        }
      });
    }
  };

  return (
    <>

{/* Notification Icon */}
{notify && (
        <div className="absolute top-4 right-4 bg-red-500 rounded-full p-2 text-white cursor-pointer">
          <AiTwotoneMessage size={24} />
        </div>
      )}

    <div className="flex h-[600px]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h3 className="text-lg font-semibold mb-4">Chats</h3>
        <ul className="space-y-2">
  {chats.map((chat) => (
    <li
      key={chat.user[0]._id}
      onClick={() => handleUserClick(chat)} // No condition here; clicking any user calls the function
      className={`cursor-pointer text p-3 rounded-lg text-black bg-white font-bold ${
        selectedUser === chat.user[0]._id
          ? 'bg-blue-100' // Highlight selected user
          : 'hover:bg-gray-300'
      }`}
    >
      {chat.user[1]._id === userId ? chat.user[0].name : chat.user[1].name}
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
              <h3 className="text-lg font-semibold text">
                {chats.find((chat) => chat.user[0]._id === selectedUser)?.user[0]?.name}
                
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
    </>
  );
}








