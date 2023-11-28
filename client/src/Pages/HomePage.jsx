import React from 'react'
import { useSelector } from "react-redux"
import TopBar from "../components/TopBar"
import CustomButton from '../components/CustomButton';
import Loading from '../components/Loading';
const HomePage = () => {
  const {user}=useSelector((state)=>state.user)
  
  return (
    <div className="home w-full px-0 lg:px-10 pb-20 2xl:px:-40 bg bg-bgColor lg:rounded-lg h-screen overflow-hidden">
      <TopBar />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        {/*LEFT */}
        {/*CENTER */}
        {/*RIGHT */}
      </div>
    </div>
  );
}

export default HomePage
