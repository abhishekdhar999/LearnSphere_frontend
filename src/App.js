import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';

import LoginUser from './Components/LoginUser';
import SignupUser from './Components/SignupUser';

import Teachers from './Pages/Teachers';
import ChatPage from './Pages/ChatPage';
import UserProfile from './Pages/UserProfile';
import Videos from './Pages/Videos';
import Navbar from './Components/Navbar';
import Skills from './Pages/Skills';
import SkillsForm from './Components/SkillsForm';
import AboutUs from './Pages/AboutUs';
import Community from './Pages/Community';
import Workplace from './Pages/Workplace';
import Review from './Pages/Review';

function App() {
 
  // console.log("url base",process.env.REACT_APP_LEARNSPHERE_BASE_URL)
  return (
    <>
    


    <Router>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loginuser" element={<LoginUser/>}> </Route>
        <Route path="/signupuser" element={ <SignupUser/>}> </Route>
        <Route path='/aboutus' element={<AboutUs/>}></Route>
        <Route path='/teachers' element={<Teachers/>}></Route>
        <Route path='/chats' element={<ChatPage/>}></Route>
        <Route path='/userprofile' element={<UserProfile/>}></Route>
        <Route path='/videos' element={<Videos/>}></Route>
        <Route path='/skills' element={<Skills/>}></Route>
        <Route path='/skillsform' element={<SkillsForm/>}></Route>
        <Route path='/communtiy' element={<Community/>}></Route>
        <Route path='/workplace' element={<Workplace/>}></Route>
        <Route path='/reviews/:id' element={<Review/>}></Route>
        
      </Routes>
    </Router>
    </>
  );
}

export default App;
