


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
        <div className="min-h-screen flex items-center justify-center ">

          <div className='w-1/2'>
            {/* Form heading */}
            <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r text from-white to-blue-700  font-bold text-center">
  REGISTER USER
  </h1>
            <img src="/rb_7965.png" alt="" />
          </div>
      <div className="w-1/2 max-w-md p-8 space-y-4  rounded-xl shadow-3xl shadow-cyan-400">
        {/* Top image */}
       

        {/* Form heading */}
        {/* <h1 className="text-4xl font-bold text-center text-gray-800">User Signup</h1> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="relative z-0 w-full group">
            <label htmlFor="floating_name" className="block mb-2 text-sm font-medium text-white">Name</label>
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
            <label htmlFor="floating_email" className="block mb-2 text-sm font-medium text-white">Email Address</label>
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
            <label htmlFor="floating_password" className="block mb-2 text-sm font-medium text-white">Password</label>
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
            <label htmlFor="floating_phone" className="block mb-2 text-sm font-medium text-white">Phone Number</label>
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
            <label htmlFor="floating_avatar" className="block mb-2 text-sm font-medium text-white">Avatar</label>
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
            <label htmlFor="floating_role" className="block mb-2 text-sm font-medium text-white">Role</label>
            <input
              type="text"
              name="role"
              id="floating_role"
              className="peer block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="Teacher or Student"
              required
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-white  to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
    );
}
