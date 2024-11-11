import axios from 'axios';
import React, { useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';

export default function Review() {
const [review,setReview] = useState('');
const [allReviews,setAllReviews] = useState([])
const { id } = useParams();
console.log("id in review",id)
const handleChange = (e)=>{
  console.log("review",review)
    e.preventDefault();
    setReview(e.target.value);
    // setReview({...review,[e.target.name]:e.target.value})
}
    const handleSubmitReview = async()=>{
      console.log("innsjbcn")
      
try {
  const response  = await axios.post(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/submitreview/${id}`,{review},{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
      'Content-Type': 'application/json',
    },
  })
  
  console.log("respinse i review",response)
  if(!response){
    console.log("error grtiing response aftrer submitting review")
  }
  if(response.status===200){
    console.log("review submitted successfully")
  }
} catch (error) {
  console.log("error",error)
}
    }
useEffect(()=>{
  console.log("use effect in review")
  const getReviewsById = async()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/reviews/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
          'Content-Type': 'application/json',
          },
          })
          console.log("response in review",response.data)
          if(response.status===200){
            console.log( "in",response.data)
            setAllReviews(response.data)

  }
  } catch (error) {
    console.log("error",error)
    }
    }

    getReviewsById();
    // setReview("")

},[id])
    
  return (
    <>

<div>
    <img className='w-[100%]' src="https://img.freepik.com/free-vector/feedback-testimonials-banner-phone-with-reviews-emoticons-comments_80328-194.jpg?ga=GA1.1.2088137649.1729805260&semt=ais_hybrid" alt="" />
    </div>
      <div className='flex justify-center my-24'>
        <h1 className='text-5xl text-white text '>Reviews</h1>
        <h1></h1>
      </div>

{/* reviews section */}
<div className='flex justify-center  items-center flex-col'>
{allReviews.length > 0 ? (
    allReviews.map((review) => {
        // Use parentheses to return the JSX directly
        return (
            <span key={review.id} className="block md:mx-12 mx-2 s  p-6 bg-gray-600 border border-gray-200 rounded-lg  shadow-lg shadow-cyan-300  dark:border-gray-700 ">
                {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">Noteworthy technology acquisitions 2021</h5> */}
                <p className="font-normal text-gray-900 text-xl"><span className='font-extrabold'>Review :</span> {review.review}</p>
                {/* Render stars based on the review rating */}
                <div className='mt-2'>
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className={index < review.rating ? 'text-yellow-400' : 'text-gray-400'}>
                            ★
                        </span>
                    ))}
                </div>
            </span>
        );
    })
) : (
    <>
        <div>
            <h1 className='bg-white text-3xl text-white text-center my-12'>No Reviews Yet</h1>
        </div>
    </>
)}
</div>


      <div className='flex justify-center items-center flex-col my-24'>
        <h1 className='text-2xl text-white text my-4'>write your review here....</h1>
        <div className=''>
            <textarea name='review' onChange={handleChange} 
            value={review} className='w-[500px] h-[100px] rounded-lg  ' type="text" placeholder='review...'/>
        </div>

        <button onClick={handleSubmitReview} className="my-2 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
submit your review
</span>
</button>
      </div>
    </>
  )
}
