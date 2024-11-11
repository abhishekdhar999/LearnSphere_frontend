import React, { useEffect, useState } from 'react';
import TeacherCard from '../Components/TeacherCard';
import axios from 'axios';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState();
  const [locationResult, setLocationResult] = useState([]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const loggedUser = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/currentuser`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessTokken'),
          },
        });
        setUser(loggedUser.data.data);
      } catch (error) {
        console.error('Error fetching the user', error);
      }
    };
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const getAllTeachers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/roleteachers`);
        if (response && response.data && response.data.data.length > 0) {
          console.log("teacher role",response.data.data)
          setTeachers(response.data.data);
        } else {
          alert('No teachers found');
        }
      } catch (err) {
        console.log(err);
        setError('Error fetching teachers. Please try again later.');
      }
    };

    getAllTeachers();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const findTeacherByLocation = async (long, lat) => {
    if (!lat || !long) {
      console.log('Latitude and longitude are missing from frontend');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/searchbylocation/${long}/${lat}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessTokken'),
        },
      });

      if (response.data && response.data.data) {
        setLocationResult(response.data.data);
      } else {
        console.log('No teachers found by location');
      }
    } catch (error) {
      console.error('Error fetching teachers by location:', error);
    }
  };

  return (
    <>
     
        <div className='flex justify-center'>

      <button
        className="bg-blue-600 text-white py-2 px-4 flex justify-center items-center rounded-lg mt-4"
        onClick={() => findTeacherByLocation(user?.location?.coordinates[0], user?.location?.coordinates[1])}
      >
        Find Teachers Near You
      </button>
        </div>


      {locationResult.length > 0 ? (
        <div className="my-8 lg:mx-24 mx-12 rounded-lg bg-slate-500 p-0">
          <h2 className="text-3xl  text-gray-200 flex justify-center font-extrabold ">Teachers Near You:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 justify-items-center ">
            {locationResult.map((teacher) => (
              <TeacherCard
                key={teacher._id}
                image={teacher.avatar}
                userId={teacher._id}
                name={teacher.name}
                charge={teacher.charge}
                location={teacher.locationCity}
                subjects={teacher.subjects}
                description={teacher.description}
                email={teacher.email}
                number={teacher.phoneNumber}
                subscribersCount={teacher.subscribersCount}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="my-4 text-gray-600"></div>
      )}

      <div className="my-12">
        {/* <form className="max-w-md mx-auto my-12">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search teachers by name, subject, etc."
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form> */}

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 justify-items-center">
          {teachers.map((teacher) => (
            <TeacherCard
            teacher={teacher}
              id={teacher._id}
              avatar={teacher.avatar}
              userId={teacher._id}
              name={teacher.name}
              charge={teacher.charge}
              location={teacher.locationCity}
              subjects={teacher.subjects}
              description={teacher.description}
              email={teacher.email}
              number={teacher.phoneNumber}
              subscribersCount={teacher.subscribersCount}
              subscribers={teacher.subscribers}
            />
          ))}
        </div>
      </div>
    </>
  );
}
