import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThrowError from './Error';
import axios from 'axios';
import { RiLoginCircleFill } from "react-icons/ri";
export default function LoginUser() {

  const [credentials, setCredentials] = useState({ email: "", password: "", repeatPassword: ""});

  const [error,setError] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,  // Spread the existing fields
      [name]: value    // Update the field that changed
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
setError("");
    const { email, password, repeatPassword } = credentials;

    if (email === "" || password === "" || repeatPassword === "") {
      setError("please fill up the credentials")
      return;
    }
    if (password !== repeatPassword) {
      // alert("Password and Repeat Password must be the same");
     setError("password and repeat password are not similar")
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        console.log("User's Latitude:", latitude);
        console.log("User's Longitude:", longitude);

        // Update credentials to include latitude and longitude
        const updatedCredentials = {
          ...credentials,
          latitude,
          longitude,
        };

        console.log('Updated credentials with location:', updatedCredentials);

        // Call the API with updated credentials
         sendCredentialsToAPI(updatedCredentials);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Could not get location. Please try again.');
      }
    );
    
console.log("crdentials",credentials)
 const sendCredentialsToAPI = async (updatedCredentials)=>{
  try {
    const response = await axios.post(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/login`, updatedCredentials ,{
     
headers:{
  'Content-Type': 'application/json'
}
    })

    



    const res = response;
    console.log("res",res.data);
    const {accessToken} = res.data.data;
    console.log("token",accessToken)
    localStorage.setItem('accessTokken', accessToken);
    if (res.status === 200) {

      // If the user is created successfully, redirect to the login page
        window.location.href = '/';
      console.log(res.data);
      } else {
        setError("Invalid credentials")
        }
    console.log("response",res)
  } catch (error) {
    // setError("lgoin failed")
  }
 }   // Call the API to create a new user
    
  };

  return (
    <>
     <div>
  <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-700 text-center text my-6">
    USERS LOGIN
  </h1>
</div>

<div>
  {error && <ThrowError error={error}/>}
</div>
 <div className='whole flex md:flex-row flex-col items-center justify-center '>
<div className='left w-1/2'>
  <img src="/rb_7885.png" alt="" />
</div>
<div className='right w-1/2 '>
<form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input type="email" name="email" id="floating_email" value={credentials?.email} className="block py-2.5 px-0 w-full text-sm text-white bg-black border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" email" required onChange={handleChange} />
          <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-white dark:text-white duration-300 transform -translate-y-12 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-12">Email address</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="password" value={credentials?.password} id="floating_password" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
          <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="repeatPassword" value={credentials?.repeatPassword} id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
          <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
        </div>
        
        <button type="submit" className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-blue-800 text">Submit</button>
      </form>

      
        <div className='flex justify-center my-6'>
        <Link to={"/signupuser"}>
      <button type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2 text">

Sign up for new user
<span className='text-2xl mx-2'>
<RiLoginCircleFill />
</span>
</button>
</Link>
</div>

</div>
      
</div> 
    </>
  );
}
