import React from 'react';
import './Welcome.css';
import welComeImage from './welcomeImage.png';


import { useSelector , useDispatch } from 'react-redux';


const Welcome = () => {
  const myinfo = useSelector((state) => state.myinfo);


  return (
    <div className="min-h-screen p-8 w-full flex justify-center items-center">
      <div className="w-full mx-auto flex flex-col md:flex-row justify-center  h-screen">
        {/* Left Column */}
        <div className="flex items-center w-full md:w-1/2">
          <div className="flex flex-col  w-full">
            <div className=" p-4">
              <h1 className="text-2xl md:text-4xl font-bold text-black text-center md:text-left">
                WELCOME BACK, {myinfo?.myinfo?.username} :)
              </h1>
            </div>

            <div className=" p-4">
              <p className="text-sm text-black text-center md:text-left">
                Start sharing your location with ease in one click.
                <br />
                Click the button to explore!!!
              </p>
            </div>

            <div className="w-full flex justify-center md:justify-start p-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"   >
                Share/Track
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Hidden for screens smaller than 900px */}
        <div className="hidden lg:flex justify-center items-center w-full md:w-1/2 " id='hello'>
          <div className="w-3/4 md:w-1/2 flex">
            <div className="aspect-square bg-gray-300 flex items-center justify-center rounded-lg">
              <img 
                src={welComeImage} 
                className="w-full h-full object-contain" 
                alt="Welcome" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
