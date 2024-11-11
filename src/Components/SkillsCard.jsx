import React from 'react';
import axios from 'axios';

export default function SkillsCard({
    skill,
    user,
    skillToLearn,
    skillToShare,
    skillLevel,
    skillType,
    skillDescription,
    skillImage,
    skillVideo,
    certifications,
    postedByUserId
}) {
console.log(" skills",skill);
console.log("postedByUserId",postedByUserId)

    const handleCreateChat = async (userId) => {
        const token = localStorage.getItem("accessTokken");
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/chat/createchat`,
            { userId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
    
          console.log("response", response);
    
          if (response.status !== 200) {
            alert('Failed to create chat');
          } else {
            alert('Chat created successfully');
            window.location.href = '/chats';  // Redirect to chats page
          }
        } catch (error) {
          console.error("Chat creation error", error);
        }
    };

    return (
        <div className="max-w-4xl bg-gray-500 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 m-4 flex">
            {/* Skill Image */}
            {skillImage && (
                <img
                    className="w-2/4 h-auto object-fill"
                    src={skillImage}
                    alt={skillToLearn[0]}
                />
            )}

            {/* Skill Content */}
            <div className="p-6 w-2/3 flex flex-col justify-between">
                <div className='font-bold'>
                    Posted by: {skill.owner}
                </div>

                {/* Skill To Learn */}
                <h2 className="text-xl font-bold text-indigo-600 mb-2">
                    Skills to Learn: {skillToLearn.join(', ')}
                </h2>

                {/* Skill To Share */}
                <h3 className="text-lg font-semibold text-gray-700">
                    Skills to Share: {skillToShare.join(', ')}
                </h3>

                {/* Skill Level and Type */}
                <div className="flex justify-between items-center mt-4">
                    <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">
                        Level: {skillLevel}
                    </span>
                    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">
                        Type: {skillType}
                    </span>
                </div>

                {/* Skill Description */}
                <p className="text-gray-600 text-sm mt-4 flex-grow">
                    {skillDescription}
                </p>

                {/* Optional Skill Video */}
                {skillVideo && (
                    <div className="mt-4">
                        <video
                            controls
                            className="w-full h-32 rounded-md border border-gray-200"
                        >
                            <source src={skillVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* Optional Certification */}
                {certifications && (
                    <div className="mt-4">
                        <a
                            href={certifications}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
                        >
                            View Certification
                        </a>
                    </div>
                )}

                {/* Message Button */}
                {user._id !== postedByUserId ? (
                    <button
                        onClick={() => handleCreateChat(skill.owner)}
                        type="button"
                        className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mt-4"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 17"
                        >
                            <path
                                fillRule="evenodd"
                                d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Message to Learn
                    </button>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}
