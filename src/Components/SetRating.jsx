import React from 'react'

export default function SetRating({rating}) {
    const totalStars = 5; 
  return (
    <>
     <div className="star-rating">
      {/* Loop through totalStars and compare with rating */}
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span key={index}>
            {starValue <= rating ? (
              <i className="fas fa-star" style={{ color: 'gold' }}></i>
            ) : (
              <i className="far fa-star" style={{ color: 'gold' }}></i>
            )}
          </span>
        );
      })}
    </div>
    </>
  )
}
