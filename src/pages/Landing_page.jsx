import React from "react";
import { Vortex } from "../components/auth_components/ui/vortex";
import { useNavigate } from 'react-router-dom';


import './landingpage.css'

export default function LandingPage() {

  const navigate = useNavigate();


  const handleButtonClick = () => {
    navigate('/auth');

  };


  const openYouTubeVideo = () => {
    window.open('https://www.youtube.com/watch?v=your_video_id', '_blank');
  };



  return (
    (<div
      className="w-[calc(100%)] mx-auto   h-screen overflow-hidden">
      <Vortex
        // backgroundColor="black"
        rangeY={800}
        // particleCount={1500} 
        // baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full">
        <h2 className="text-white text-4xl md:text-8xl font-bold text-center font-roboto">
          Share Your Location In Real Time
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Now share your realtime location with your <br /> family-peers-friends  in one click :)
         
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            className="px-8 py-3 bg-blue-600 hover:bg-white-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]   text-2xl"  onClick={handleButtonClick}>
            Get Started
          </button>
          <button className="px-8 bg-white py-3   text-2xl transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] set-black"  onClick={openYouTubeVideo}     >Get a Demo</button>
        </div>
      </Vortex>
    </div>)
  );
}


