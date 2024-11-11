import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons
import axios from 'axios';

const StarRating = ({ id }) => {
    const [hover, setHover] = useState(null); // Stores the star the user is hovering over
    const [rating, setRating] = useState(null); // Stores the selected rating

    const handleSubmitRating = async (rat) => {
        const body = {
            rating: rat,
            teacherInUsersId: id,
        };

        console.log("body in frintend",body)
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/submitrating`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
                        'Content-Type': 'application/json', // Use application/json for JSON data
                    },
                }
            );

            if (response.status !== 200) {
                console.log("No response recorded");
            } else {
                setRating(rat); // Update the selected rating state
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    return (
        <div>
            <div className="star-rating flex">
                {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1; // Rating value (1-5)

                    return (
                        <label key={index}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => handleSubmitRating(ratingValue)} // Set rating on click
                                style={{ display: 'none' }} // Hide the default radio input
                            />
                            <FaStar
                                className='flex justify-center'
                                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} // Set the color
                                size={25} // Set size of the star icon
                                onMouseEnter={() => setHover(ratingValue)} // Highlight star on hover
                                onMouseLeave={() => setHover(null)} // Unhighlight when not hovering
                                style={{ cursor: 'pointer' }} // Change cursor to pointer 
                            />
                        </label>
                    );
                })}
            </div>
            {rating && <p>You rated: {rating} out of 5 stars</p>}
        </div>
    );
};

export default StarRating;
