import React, { useState } from 'react';
import axios from 'axios';

export default function SkillsForm() {
  const [skillData, setSkillData] = useState({
    skillToLearn: '',
    skillToShare: '',
    skillLevel: '',
    skillType: '',
    skillDescription: '',
    skillImage: null,
    skillVideo: null,
    certifications: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setSkillData({
      ...skillData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSkillData({
      ...skillData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a new FormData instance for each submission to prevent file data from overlapping
    const formData = new FormData();
    formData.append('skillToLearn', skillData.skillToLearn);
    formData.append('skillToShare', skillData.skillToShare);
    formData.append('skillLevel', skillData.skillLevel);
    formData.append('skillType', skillData.skillType);
    formData.append('skillDescription', skillData.skillDescription);

    if (skillData.skillImage) formData.append('skillImage', skillData.skillImage);
    if (skillData.skillVideo) formData.append('skillVideo', skillData.skillVideo);
    if (skillData.certifications) formData.append('certifications', skillData.certifications);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/skills/createskills`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Skill data submitted:', response.data);
      alert('Skill data submitted successfully!');
      
      // Clear form fields after submission
      setSkillData({
        skillToLearn: '',
        skillToShare: '',
        skillLevel: '',
        skillType: '',
        skillDescription: '',
        skillImage: null,
        skillVideo: null,
        certifications: null,
      });
    } catch (error) {
      console.error('Error submitting skill data:', error);
      alert('Failed to submit skill data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Submit Your Skills</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Skill to Learn */}
        <div>
          <label className="block text-gray-700 font-medium">Skills to Learn</label>
          <input
            type="text"
            name="skillToLearn"
            value={skillData.skillToLearn}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g., Web Development"
            required
          />
        </div>

        {/* Skill to Share */}
        <div>
          <label className="block text-gray-700 font-medium">Skills to Share</label>
          <input
            type="text"
            name="skillToShare"
            value={skillData.skillToShare}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g., Data Analysis"
            required
          />
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-gray-700 font-medium">Skill Level</label>
          <select
            name="skillLevel"
            value={skillData.skillLevel}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Skill Type */}
        <div>
          <label className="block text-gray-700 font-medium">Skill Type</label>
          <input
            type="text"
            name="skillType"
            value={skillData.skillType}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g., Soft Skill, Technical Skill"
            required
          />
        </div>

        {/* Skill Description */}
        <div>
          <label className="block text-gray-700 font-medium">Skill Description</label>
          <textarea
            name="skillDescription"
            value={skillData.skillDescription}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a detailed description of the skill..."
            required
          />
        </div>

        {/* Skill Image */}
        <div>
          <label className="block text-gray-700 font-medium">Upload Skill Image</label>
          <input
            type="file"
            name="skillImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Skill Video */}
        <div>
          <label className="block text-gray-700 font-medium">Upload Skill Video (optional)</label>
          <input
            type="file"
            name="skillVideo"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-gray-700 font-medium">Certifications (optional)</label>
          <input
            type="file"
            name="certifications"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`${
              isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition transform hover:-translate-y-1`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Skills'}
          </button>
        </div>
      </form>
    </div>
  );
}
// http://res.cloudinary.com/dnjxcxxzt/image/upload/v1730534449/images.webp