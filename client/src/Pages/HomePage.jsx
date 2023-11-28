import React from 'react'
import { useSelector } from "react-redux"
import TopBar from "../components/TopBar"
import CustomButton from '../components/CustomButton';
import Loading from '../components/Loading';
import ProfileCard from '../components/ProfileCard';
import FriendsCard from '../components/FriendsCard';
const HomePage = () => {
  const {user}=useSelector((state)=>state.user)
  
  return (
    <div className="home w-full px-0 lg:px-10 pb-20 2xl:px:-40 bg bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <TopBar />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        {/*LEFT */}
        <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
          <ProfileCard user={user}/>
          <FriendsCard friends={user?.friends}/>
        </div>
        {/*CENTER */}
        {/*RIGHT */}
      </div>
    </div>
  );
}

export default HomePage