


import React, { useState } from 'react';
import axios from 'axios';

export default function SignupUser() {
    // Set state for form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        avatar: null, // For file upload
        role: '',
    });

    
    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
          });
    };

    const handleFileChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.files[0],
        });
      };
    
    // Handle form submit
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Prepare form data for sending as multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("role", formData.role);
      
      // Append file to form data (if file is present)
      if (formData.avatar) {
        console.log("formdata avatr",formData.avatar)
        formDataToSend.append("avatar", formData.avatar);
      }


      console.log("form data",formData)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
  
          console.log("User's Latitude:", latitude);
          console.log("User's Longitude:", longitude);
  
          const floatLongitude = parseFloat(longitude);
          const floatLatitude = parseFloat(latitude);
  
          // Validate that they are numbers and not NaN
          if (isNaN(floatLongitude) || isNaN(floatLatitude)) {
              throw new Error("Longitude and latitude must be valid numbers");
          }

          // Update credentials to include latitude and longitude
          const updatedFormData = {
            ...formData,
            floatLongitude,
            floatLatitude,
          };
  
          console.log('Updated credentials with location:', updatedFormData);
  
          // Call the API with updated credentials
           sendData(updatedFormData);
        }
      )
  
      
          // Send POST request to backend API with formData
      const sendData = async (updatedFormData)=>{   
        try { 
        const response = await axios.post(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/register`, updatedFormData, {
              headers: {
                  'Content-Type': 'multipart/form-data', // Required for file upload
              },
          });
  
          // Handle successful response
          console.log("response 1",response.data);
          if (response.status !== 200) {
              alert('Failed to create user');
          } else {
              alert('User created successfully');
              window.location.href = '/';  // Redirect to home page
          }
        
      } catch (error) {
          // Handle error response
          console.error('Error registering user:', error);
          alert('Error registering user.');
      }
    }
    
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl">
        {/* Top image */}
        <div className="flex justify-center mb-6">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDN8fHVzZXIlMjBhdmF0YXJ8ZW58MHx8fHwxNjE5NDc5Mjg0&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Signup Visual"
            className="w-32 h-32 rounded-full border-4 border-pink-500"
          />
        </div>

        {/* Form heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800">User Signup</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="relative z-0 w-full group">
            <label htmlFor="floating_name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="floating_name"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Your name"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="floating_email" className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="floating_email"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Your email"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="floating_password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="floating_password"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Password"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="floating_phone" className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              id="floating_phone"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Your phone number"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="floating_avatar" className="block mb-2 text-sm font-medium text-gray-700">Avatar</label>
            <input
              type="file"
              name="avatar"
              id="floating_avatar"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              required
              onChange={handleFileChange}
            />
          </div>

          <div className="relative z-0 w-full group">
            <label htmlFor="floating_role" className="block mb-2 text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              id="floating_role"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Your role"
              required
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
    );
}
