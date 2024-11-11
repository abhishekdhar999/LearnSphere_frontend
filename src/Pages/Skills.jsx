import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import SkillsCard from '../Components/SkillsCard';

export default function Skills() {
const[skills,setSkills] = useState([]);
const [user,setUser] = useState()

const [query,setQuery] = useState({skillToLearn:"",skillToShare:""});
const [result,setResult] = useState([]);
useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const loggedUser = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/users/currentuser`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessTokken')
          }
        });
        console.log("logged user", loggedUser.data.data);
        if (!loggedUser) {
          console.log("No logged-in user");
        }
        setUser(loggedUser.data.data);
      } catch (error) {
        console.error("Error fetching the user", error);
      }
    };
    fetchLoggedInUser();
  }, []);


useEffect(()=>{


    const allSkills = async ()=>{
        const response  = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/skills/allskills`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
            }
        })

        if(response.status !== 200){
            console.log("Error fetching data")
        }
        console.log("response all skills",response)
        setSkills(response.data.data)
    }

    allSkills()
},[])

const handleChange = (e)=>{
    console.log("query",query);
    e.preventDefault();
    setQuery({...query,[e.target.name]:e.target.value})

}

const handleSearch = async (e) => {
    e.preventDefault();
  
    // Ensure both input fields are filled
    if (!query.skillToLearn || !query.skillToShare) {
      console.log("Please fill both fields");
      return;
    }
  
    const queryParams = {
      skillToLearn: query.skillToLearn.trim(" "),
      skillToShare: query.skillToShare.trim(" ")
    };
  
    try {
      // Make the GET request to your search endpoint
      const response = await axios.get(`${process.env.REACT_APP_LEARNSPHERE_BASE_URL}/skills/search`, {
        params: queryParams,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessTokken')}`,
        },
      });
  
      // If successful, update the result state
      if (response.status === 200) {
        console.log("Search response:", response.data);
        setResult(response.data.data);
      } else {
        console.log("Search failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };
  
  return (
    <>
{/* search */}
<div className='search'>
<div className="flex items-center justify-center    ">
      <div className="bg-gray-500 rounded-lg  p-8 w-full mx-12 my-12 shadow-xl shadow-slate-800">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Search Skills According To You</h2>
        

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="input1">Skill To Learn</label>
            <input
              type="text"
              id="input1"
              name="skillToLearn"
              onChange={handleChange}
              value={query.skillToLearn}
              placeholder="Enter your first input"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="input2">Skill To Share</label>
            <input
              type="text"
              id="input2"
              name="skillToShare"
              onChange={handleChange}
              value={query.skillToShare} 
              placeholder="Enter your second input"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"/>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200">
            Submit
          </button>
        </form>
      </div>
    </div>
</div>

<div className='flex justify-center'>
<Link to={"/skillsform"}>
 
      <button type="button" class="text-white w-[50vw]  overflow-hidden mx-12 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-extrabold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">post your skill</button>
      </Link>
      </div>

<div className='flex justify-center'> {result.length > 0 ? (
  <div className="search-results">
    {result.map((skill, index) => (
      <SkillsCard
        skill={skill}
        user={user}
        name={skill.owner.name || ""}
        key={index}
        skillToLearn={skill.skillToLearn}
        skillToShare={skill.skillToShare}
        skillLevel={skill.skillLevel}
        skillType={skill.skillType}
        skillDescription={skill.skillDescription}
        skillImage={skill.skillImage}
        skillVideo={skill.skillVideo}
        certifications={skill.certifications}
      />
    ))}
  </div>
) : (
  <p></p>
)}
   </div>

      


      {skills.length > 0 ? <div className="flex flex-wrap justify-center">
      {skills.map((skill, index) => (
        <SkillsCard
        skill={skill}
        user={user}
        name={skill.owner.name || ""} 
        postedByUserId={skill.owner}
          key={index}
          skillToLearn={skill.skillToLearn}
          skillToShare={skill.skillToShare}
          skillLevel={skill.skillLevel}
          skillType={skill.skillType}
          skillDescription={skill.skillDescription}
          skillImage={skill?.skillImage}
          skillVideo={skill.skillVideo}
          certifications={skill.certifications}
        />
      ))}
    </div> :   <div>loading</div>
      }
    </>
  )
}
