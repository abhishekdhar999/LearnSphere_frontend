import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThrowError from './Error';
import axios from 'axios';

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
      <div><h1 className='text-4xl'>USER LOGIN</h1></div>

<div>
  {error && <ThrowError error={error}/>}
</div>

      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input type="email" name="email" id="floating_email" value={credentials?.email} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
          <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="password" value={credentials?.password} id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
          <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input type="password" name="repeatPassword" value={credentials?.repeatPassword} id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} />
          <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
        </div>
        
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>

      <Link to={"/signupuser"}>
        <h1 className='flex justify-center text-xl'>Sign up for new user</h1>
      </Link>
    </>
  );
}
