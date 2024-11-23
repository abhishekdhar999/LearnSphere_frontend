import React, { useEffect, useState } from 'react';
import Whiteboard from '../Components/Whiteboard';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CiVideoOn } from "react-icons/ci";
import {jwtDecode} from 'jwt-decode';
import VideoCall from '../Components/VideoCall';
import { AiTwotoneMessage } from "react-icons/ai";
import { useSocket } from '../Context/SocketProvider';
import { Link } from 'react-router-dom';
export default function Workplace() {
  const socket = useSocket()
  // const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
const [model,setModel] = useState(false)
  const location = useLocation();
  const { community } = location.state || {};
const [users,setUsers] = useState([])
const [searchTerm,setSearchTerm] = useState('')
const [filteredUserss,setFilteredUserss] = useState([])

const [showRemove, setShowRemove] = useState({});

  const handleShowRemove = (participantId) => {
    setShowRemove((prevState) => ({
      ...prevState,
      [participantId]: !prevState[participantId], // Toggle showing the cross icon
    }));
  };
  // Fetch and decode token
  useEffect(() => {
    const token = localStorage.getItem('accessTokken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken._id);
        console.log('Logged in user ID:', decodedToken._id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // removing the user
  const onRemove = async (participantId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/community/removeparticipant`,
        { participantId, communityId: community._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
          },
        }
      );

      if (response.status === 200) {
        // Update participants list after removal
        setParticipants((prevParticipants) =>
          prevParticipants.filter((participant) => participant._id !== participantId)
        );
      }
    } catch (error) {
      console.log('Error removing participant:', error);
    }
  };

  // Fetch group chat by groupChatId
  useEffect(() => {
    const communityGroupChatByGroupChatId = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/chat/fetchgroupchat/${community.groupChatId}`
      );
      if (response.data) {
        console.log("check",response.data.data)
        console.log('Participants:', response.data.data.participants);
        setParticipants(response.data.data.participants);
      }
    };
    communityGroupChatByGroupChatId();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      if (!community.groupChatId) return;

      try {
        const token = localStorage.getItem("accessTokken");
        const response = await axios.get(
          `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/message/getMessages/${community.groupChatId}`, // Sending chatId as a URL param
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
  }, [community.groupChatId]);


  // Handle sending messages
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return; // Do nothing if message is empty

    try {
      const token = localStorage.getItem('accessTokken');

      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/message/sendmessages`,
        { chatId: community.groupChatId, content: newMessage, isGroupChat: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: { _id: userId }, content: newMessage }, // Mimic server structure
        ]);
        setNewMessage(''); // Clear input after sending

        const wsMessage = { chatId: community.groupChatId, sender: { _id: userId }, content: newMessage };
        // socket.emit('sendMessage', wsMessage);
        socket.emit("sendMessage",JSON.stringify(wsMessage));
        // if (socket && socket.readyState === WebSocket.OPEN) {
        //   const wsMessage = { chatId: community.groupChatId, sender: { _id: userId }, content: newMessage };
        //   socket.send(JSON.stringify(wsMessage)); // Send message via WebSocket
        // }
      }
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // get messages
  useEffect(() => {
    const getMessages = async () => {
      if (!community.groupChatId) return;

      const chatId = community.groupChatId;
      console.log("chat id",chatId)
      try {
        console.log("in try")
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
console.log("msg ",response.data)
        setMessages(response.data); // Set the messages for selected chat
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [community.groupChatId]);

  // Set up WebSocket for real-time messages
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

// fetch all users
useEffect(()=>{
  const getAllUsers = async()=>{
      const allUsers = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/allusers`,{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessTokken')
          }
        })
        if(allUsers.status !== 200){
          return
        }
        setUsers(allUsers.data.data) 

  }
getAllUsers()
},[])

const openModel = ()=>{
setModel(!model);
}

useEffect(() => {
  if (searchTerm.trim() === '') {
    setFilteredUserss(''); // Show all users if search term is empty
  } else {
    console.log("inside")
    const lowerCasedSearchTerm = searchTerm.toLowerCase(); // Normalize input to lowercase
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(lowerCasedSearchTerm) || // Modify according to user object structure
      user.email.toLowerCase().includes(lowerCasedSearchTerm)
    );
    setFilteredUserss(filtered);
  }
}, [searchTerm, users]);


  const handleAddParticipant = async (id)=>{

    const response = await axios.post(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/community/addparticipant`,{
participantsId:id,
communityId:community._id
    },{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessTokken')
      }
    })

    if(response.status === 200){
      console.log("resssssssssss",response)
    }
    setSearchTerm('');
    window.location.reload();
  }





  // for notification
  // useEffect(() => {
  //   const ws = new WebSocket(process.env.REACT_APP_WEB_SOCKET_URL);
  //   setSocket(ws);

  //   ws.onmessage = (event) => {
  //     try {
  //       const receivedMessage = JSON.parse(event.data);
        
  //       // Check if the message is intended for the current user
  //       if (receivedMessage.receiverId === userId) {
  //         // Trigger notification
  //         displayNotification(receivedMessage.content);
  //       }
        
  //       // Add message to the list for displaying in UI if needed
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { sender: receivedMessage.sender, content: receivedMessage.content },
  //       ]);
  //     } catch (error) {
  //       console.error('Error parsing WebSocket message:', error);
  //     }
  //   };
  //   return () => {
  //     ws.close();
  //   };
  // }, [userId]);

  // const displayNotification = (messageContent) => {
  //   if (Notification.permission === "granted") {
  //     new Notification("New Message", {
  //       body: messageContent,
  //       icon: <AiTwotoneMessage /> // Optional, replace with actual icon path
  //     });
  //   } else if (Notification.permission !== "denied") {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === "granted") {
  //         new Notification("New Message", {
  //           body: messageContent,
  //           icon: <AiTwotoneMessage />
  //         });
  //       }
  //     });
  //   }
  // };
 

  return (
    <>

    <div className='flex justify-center my-12'>
      <img className='h-[600px] rounded-lg shadow-xl shadow-white ' src="https://img.freepik.com/free-vector/freelancer-coworking-business-center-banner_81522-4517.jpg?t=st=1730566288~exp=1730569888~hmac=25b4ac8278a5ce5efb56fe9d366dbabb3800fca9e673a75d80007a65befe013a&w=2000" alt="" />
    </div>
      <Whiteboard community={community} />
<div className='flex justify-center my-6'>
  <Link to={"/lobby"}>
      <button type="button" class="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-bold text rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2 mt-1">
     <span className='font-extrabold text-2xl mx-4'><CiVideoOn /></span> 
Start Instant Meeting
</button>
</Link>
</div>



{model && (
  <div className='my-12' >
<form class="flex bg-white items-center max-w-lg mx-auto">   
    <label for="voice-search" class="sr-only">Search</label>
    <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"/>
            </svg>
        </div>
        <input type="text" id="voice-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  />
        <button type="button" class="absolute inset-y-0 end-0 flex items-center pe-3">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"/>
            </svg>
        </button>
    </div>
    {/* <button type="submit" class="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>Search
    </button> */}
</form>

<div className='filters-users'>
  {filteredUserss.length > 0 ? (
    filteredUserss.map((user) => (
      <div key={user.id} className="user-item">
        {/* Render user details */}

        <p className=' hover: cursor-pointer' onClick={()=>{handleAddParticipant(user._id)}} >{user.name}</p>
      </div>
    ))
  ) : (
    <p>No users found</p> // Display message if no users are found
  )}
</div>


</div>
)}


      <div className='flex h-screen'>
        {/* Left Section */}
        <div className='w-1/4 bg-gray-800 p-4 text-white'>
          <div className='flex justify-between'>
          <div className='text-xl font-semibold mb-4 border-b pb-2'>Participants</div>

          <div className='mt-2'>
            <button onClick={openModel}>
            {model ? 'cancel' : "add"}  
              </button>
          </div>
          </div>

          <div className='space-y-2'>
      {participants?.length > 0 ? (
        participants?.map((participant) => (
          <div
            key={participant._id}
            className='bg-gray-700 p-3 rounded-lg shadow-md hover:bg-gray-600 transition-all flex justify-between items-center'
          >
            <span>{participant.name}</span>
            <button
              className='text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600'
              onClick={() => handleShowRemove(participant._id)}
            >
              Toggle Remove
            </button>

            {/* Show the cross icon if toggle is on */}
            {showRemove[participant._id] && (
              <button
                className='ml-2 text-white bg-transparent hover:text-red-500'
                onClick={() => onRemove(participant._id)}
              >
                ❌
              </button>
            )}
          </div>
        ))
      ) : (
        <div>No current users</div>
      )}
    </div>
        </div>

        {/* Middle Divider */}
        <div className='w-1 bg-gray-600'></div>

        {/* Right Section */}
        <div className='w-3/4 flex flex-col p-6'>
          {/* Messages */}
          <div className='flex-1 overflow-y-auto bg-white rounded-lg shadow-lg p-4'>
            <h1 className='text-xl font-semibold mb-4'>Messages</h1>
            <div className='space-y-3'>
  {messages.length > 0 ? (
    messages.map((msg, index) => (
      <div
        key={index}
        className={`p-3 rounded-lg ${
          msg?.sender?._id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        <div className='flex justify-between items-center'>
          {/* Message content on the left */}
          <div className='w-3/4 text-left border-r-2 border-gray-400 pr-4'>
            {msg.content}
          </div>

          {/* Sender's name on the right */}
          <div className='w-1/4 text-right pl-4'>
            <span className='font-semibold'>{msg?.sender?.name || 'Anonymous'}</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className='text-center text-gray-400'>No messages yet</div>
  )}
</div>

          </div>

          {/* Input Area */}
          <div className='mt-4'>
            <div className='flex'>
              <input
                type='text'
                className='flex-1 border-2 border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Type a message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className='bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-all'
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* <VideoCall community={community}></VideoCall> */}
    </>
  );
}
