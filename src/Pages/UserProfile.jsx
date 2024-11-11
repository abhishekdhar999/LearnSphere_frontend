

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import VideoComponent from '../Components/VideoComponent';
export default function UserProfile() {
  const [user, setUser] = useState();
  
  const [model, setModel] = useState(false);

  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    duration: '',
    videoFile: null,
    coverImage: null
  });

  const [profileVideo,setProfileVideo] = useState([]);

  useEffect(()=>{
    const getAllVideoOfLoggedInUser = async ()=>{
      const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/videos/allvideos`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessTokken')}`,
          },
      })

      console.log("res",response.data.data)
      setProfileVideo(response.data.data);
    }
    getAllVideoOfLoggedInUser()
  },[])

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const loggedUser = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/currentuser`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessTokken')
          }
        });
        console.log("logged user", loggedUser.data.data);
        if (!loggedUser) {
          console.log("No logged-in user");
        }
        setUser(loggedUser.data.data);
      } catch (error) {
        console.error("Error fetching the user", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleEdit = () => {
    setModel(!model);
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("user",user)
    try {
   

    const updatedUserData = {
        name: user.name,
        location: user.location,
        description: user.description,
        charge: user.charge,
        subjects:user.subjects
      };

console.log("updatedUserData",updatedUserData)

      const response = await axios.put(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/edituser`, updatedUserData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessTokken'),
         'Content-Type': 'application/json',
        },
      });

      console.log("response",response)
      if (response.status === 200) {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  }






  const handleInputChange = (e) => {
    setVideoData({
      ...videoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setVideoData({
      ...videoData,
      [e.target.name]: e.target.files[0],
    });
  };
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('duration', videoData.duration);
    formData.append('videoFile', videoData.videoFile); // Append video file
    formData.append('coverImage', videoData.coverImage); // Append optional cover image

    try {
      const response = await axios.post(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/videos/postvideo`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessTokken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert("Video uploaded successfully!");
      }
    } catch (err) {
      console.error("Error uploading video", err);
      alert("Failed to upload video.");
    }
  };

  

  return (
    <>
     

      {model && (
        <div className='model flex justify-center'>
          {/* <!-- Main modal --> */}
          <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Your Profile
                  </h3>
                  <button onClick={handleEdit} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <form onSubmit={handleSubmit} className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={user.name} // Bind to the state
                        onChange={handleChange} // Handle changes
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        placeholder="Type your name"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="charge" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Charge per hour</label>
                      <input
                        type="text"
                        name="charge"
                        value={user.charge} // Bind to the state
                        onChange={handleChange} // Handle changes
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        placeholder="Type charge"
                       
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={user.locationCity} // Bind to the state
                        onChange={handleChange} // Handle changes
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        placeholder="Type location"
                        
                      />
                    </div>
                    {user.role === 'Teacher' && (<div className="col-span-2">
                      <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subjects</label>
                      <input
                        type="text"
                        name="subjects"
                        value={user.subjects} // Bind to the state
                        onChange={handleChange} // Handle changes
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        placeholder="Type location"
                        
                      />
                    </div>)}
                    <div className="col-span-2">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">About</label>
                      <textarea
                        name="description"
                        value={user.description} // Bind to the state
                        onChange={handleChange} // Handle changes
                        rows="4"
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        placeholder="Write about yourself here"
                      />
                    </div>
                  </div>
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-center my-12 rounded-full'>
        <img className='h-48 w-48 rounded-full' src={user.avatar} alt="User Avatar" />
      </div>

      <div className="bg-white my-6 h-auto shadow overflow-hidden sm:rounded-lg">
        <div className='flex justify-end mx-12 my-2'>
          <button onClick={handleEdit} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5">
            Edit
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
            </div>
            {user?.role === 'Teacher' && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Subjects</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.subjects}</dd>
              </div>
            )}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.locationCity}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.description}</dd>
            </div>
            {user?.role === 'Teacher' && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Charge per hour</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.charge}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>


{/* video upload */}
{user.role === "Teacher" && <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Your Video</h2>
  <form onSubmit={handleVideoSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        type="text"
        name="title"
        value={videoData.title}
        onChange={handleInputChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Enter video title"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        name="description"
        value={videoData.description}
        onChange={handleInputChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Enter video description"
      ></textarea>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (in minutes)</label>
      <input
        type="number"
        name="duration"
        value={videoData.duration}
        onChange={handleInputChange}
        required
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Video duration"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
      <input
        type="file"
        name="videoFile"
        onChange={handleFileChange}
        required
        className="w-full text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (optional)</label>
      <input
        type="file"
        name="coverImage"
        onChange={handleFileChange}
        className="w-full text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>

    <div className="flex justify-center">
      <button
        type="submit"
        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Upload Video
      </button>
    </div>
  </form>
</div>}



    {/* Display uploaded videos here */}
    {user.role === 'Teacher' && 

<div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Videos Uploaded by You</h2>
  
</div>
}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{user.role === 'Teacher' && 

profileVideo.map((video)=>{
return (
  <VideoComponent video={video}/>
)
}) }


    {/* <VideoComponent/> */}
  </div>
    </>
  );
}
