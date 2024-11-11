import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const [title, setTitle] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userCommunity, setCommunity] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/allusers`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessTokken')
        }
      });
      if (allUsers.status === 200) {
        setUsers(allUsers.data.data);
      }
    };
    getAllUsers();
  }, []);

  const handleSelectUser = (user) => {
    if (selectedUsers.some(selUser => selUser._id === user._id)) {
      alert("User is already added");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
    setFilteredUsers([]);
  };

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setSearchTerm("");
  };

  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((selUser) => selUser._id !== user._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const communityData = { title, selectedUsers };
    console.log("comm data",communityData)
    const response = await axios.post(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/community/createcommunity`,{title,selectedUsers}, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessTokken'),
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      setFilteredUsers([]);
      setSearchTerm('');
      setSelectedUsers([]);
      setTitle('')
      alert("community created successfully")
      
    } else {
      alert("Can't create community");
    }
  };

  useEffect(() => {
    const getAllCommunitiesOfLoggedInUser = async () => {
      const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/community/getcommunities`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessTokken')
        }
      });
      if (response.status === 200) {
        setCommunity(response.data.data);
      }
    };
    getAllCommunitiesOfLoggedInUser();
  }, []);

  const handleClick = (community) => {
    navigate('/workplace', { state: { community } });
  };

  return (
    <>
   
      <div className="flex justify-center items-center h-[80vh] bg-gray-300 my-12 ">
        <img className="max-w-full h-auto rounded-lg" src={"/createcommunity.png"} alt="Community" />
      </div>

      <div className="md:mx-24 mx-auto bg-gray-800 p-8 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-semibold mb-6 text-green-400">Create Community</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Community Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter community title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Search Users:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for users"
            />
            <button
              onClick={handleSearch}
              type="button"
              className="mt-2 text-white bg-green-600 hover:bg-green-500 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Search
            </button>
          </div>

          <div className="mb-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer rounded-lg mb-2"
                  onClick={() => handleSelectUser(user)}
                >
                  {user.name}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Selected Users:</label>
            {selectedUsers.length === 0 ? (
              <p className="text-gray-500">No users selected</p>
            ) : (
              selectedUsers.map((user) => (
                <div key={user._id} className="p-2 bg-gray-700 rounded-lg mb-2 flex justify-between items-center">
                  <span>{user.name}</span>
                  <button
                    onClick={() => handleRemove(user)}
                    className="text-red-400 hover:text-red-500 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
          >
            Create Community
          </button>
        </form>
      </div>

      <div className="mt-12">
        <h1 className="text-4xl text-center font-bold text-green-400 mb-8">Your Created Communities</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCommunity.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">You haven't created any communities yet.</p>
          ) : (
            userCommunity.map((community) => (
              <div key={community._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-400">{community.title}</h2>
                <p className="text-gray-400 mt-2">Engage and manage your community effectively.</p>
                <button
                  onClick={() => handleClick(community)}
                  className="mt-4 inline-flex items-center text-sm font-medium text-white bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
                >
                  View Community
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.293-9.707a1 1 0 011.414 0L10 10.586V6a1 1 0 112 0v4.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
