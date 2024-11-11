import React, { useEffect,useState } from 'react'
import VideoComponent from '../Components/VideoComponent'
import axios from 'axios';
export default function Videos() {

const [allVideos,setAllVideos] =  useState([]);

useEffect(()=>{
  const fetchVideos = async () => {
    const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/videos/entirevideos`,{
      headers:{
        'Authorization': 'Bearer ' + localStorage.getItem('accessTokken'),
      }
    })
    const data = response.data;
    const vid =data.data
     console.log("data",vid)
    console.log(typeof(vid))
     setAllVideos(vid);
    }
    fetchVideos();
    },[])
  return (
    <>

   
   {allVideos.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {allVideos.map((video) => (
    <div key={video._id}> 
      <VideoComponent
        video ={video}
        
      />
    </div>  
  ))}
</div>
: <div>
  no videos to show
</div> }
    
    </>
  )
}
