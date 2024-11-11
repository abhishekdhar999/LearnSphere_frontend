import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import SetRating from './SetRating';
export default function TeacherCard({
  teacher,
  id,
  name,
  avatar,
  userId,
  number,
  charge,
  email,
  description,
  subjects,
  location,
  subscribersCount,
}) {
  const [isSubscribed, setSubscribed] = useState(false);

const [rating,setRating]=useState()
  const handleSubscribe = async (channelId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/subscription/subscribe`,
        { channelId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("response", response);

      if (response.status === 200) {
        alert("Subscribed successfully");
        setSubscribed(true);  // Update state to reflect subscription
      }
    } catch (error) {
      console.error("Subscription error", error);
    }
  };

  const handleUnsubscribe = async (channelId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/subscription/unsubscribe`,
        { channelId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        setSubscribed(false);  // Update state to reflect unsubscription
        alert("Unsubscribed successfully");
      }
    } catch (error) {
      console.error("Unsubscription error", error);
    }
  };

  const showToolTip = () => {
    alert("Subscribe to see the videos");
  };

  // Check if user is already subscribed on component mount
  useEffect(() => {
    const checkSubscriptionStatus = async (channelId) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/subscription/checksubscribed/${channelId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
              // 'Content-Type': 'application/json',
            },
          }
        );
        console.log("response in subscription", response.data);

        if (response.status === 200 && response.data.isSubscribed) {
          setSubscribed(true); // Set state if user is subscribed
        } else {
          setSubscribed(false); // Set state if user is not subscribed
        }
      } catch (error) {
        console.error("Check subscription error", error);
      }
    };

    checkSubscriptionStatus(userId);
  }, [userId]);

  const handleCreateChat = async (userId) => {
    const token = localStorage.getItem("accessTokken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/chat/createchat`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("response", response);

      if (response.status !== 200) {
        alert('Failed to create chat');
      } else {
        alert('Chat created successfully');
        window.location.href = '/chats';  // Redirect to chats page
      }
    } catch (error) {
      console.error("Chat creation error", error);
    }
  };
useEffect(()=>{
  const handleGetRating = async(id)=>{
    const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/getrating/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
        "Content-Type": "application/json",
      },
    })

    if(!response){
      console.log("no rating to fetch ")
    }

     console.log("rating response",response.data.data)
     setRating(response.data.data)
  }
handleGetRating(userId);
},[userId])
  

  return (
    <div className="p-16">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">{subscribersCount}</p>
              <p className="text-gray-400">Subscribers</p>
            </div>
            <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center ml-12">
              {isSubscribed ? (
                <Link to="/videos">
                  <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                    Videos
                  </button>
                </Link>
              ) : (
                <button
                  onMouseOver={() => showToolTip()}
                  className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                >
                  Videos
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <img className="w-full h-full object-cover rounded-full" src={teacher.avatar} alt={name} />
            </div>
          </div>

          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            {isSubscribed ? (
              <button
                onClick={() => handleUnsubscribe(userId)}
                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Unsubscribe
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(userId)}
                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            )}

            <button
              onClick={() => handleCreateChat(userId)}
              className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Message
            </button>
          </div>
        </div>

        <div className="mt-20 text-center border-b-2 border-b-black pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {name} <span className="font-light text-gray-500"></span>
          </h1>
          <p className="font-light text-gray-600 mt-3">
            <span className="font-extrabold text-xl">{location}</span>
          </p>
          <p className="mt-8 text-gray-500">
            Charge per Hour: <span className="font-extrabold text-xl">{charge}</span>
          </p>
          <p className="mt-2 text-gray-500">{email}</p>
          <p className="mt-2 text-gray-500">{number}</p>

          <div className='flex justify-center my-2 text-center'>
        <button type="button" class="text-white  bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-extrabold rounded-lg text-sm px-5 py-2.5 text-center w-52 items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2 ">
{/* <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
<path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
</svg> */}
Book a class
</button>
</div>

<div className='flex justify-between mx-2'>
  <div className='flex '>
<p className='font-bold text-lg'>Rating :{rating?.rating}  </p>
<div className='flex'>
<SetRating></SetRating>
</div>

  </div>

  <div className='font-bold text-lg'>
<Link to={`/reviews/${id}`}>See Reviews</Link>
  </div>
</div>
        </div>

        <div className="mt-12 flex flex-col justify-center">
          <p className="flex justify-center">Specialised In:</p>
          <p className="text-gray-600 text-center font-light lg:px-16">{subjects}</p>
        </div>

        <div className="mt-12 flex border-t-4 border-b-black flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">{description}</p>
        </div>
{isSubscribed ? ( <div>
<button>Rate This Teacher</button>
        <StarRating id={userId}></StarRating>
</div>) : ("subscribe to rate the teacher")}

       
      </div>

      
    </div>
  );
}
