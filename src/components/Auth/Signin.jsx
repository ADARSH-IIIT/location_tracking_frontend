"use client";
import { Label } from "../auth_components/ui/lsbel";
import { cn } from "../utils/cn";
import { Input } from "../auth_components/ui/Input";
import { useState } from "react";

// import { axiosInstance, signinApi } from "../../apiList";
import validator from 'validator';

import {signin_api , axiosinstance } from '../../api_list'
import { useNavigate } from "react-router-dom";

import { useAlert } from 'react-alert'


export function Signin({ setSignin }) {


  const alert = useAlert()


  const navigateTo = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");


 

  const handleSubmit = async () => {
   
    let validation_error = false ;

    if( !password || !email){
     return  alert.show("pls enter all creds")
    }

 
    if(password.length<8){
      alert.show("password should have atleast 8 characters" )
      validation_error = true

    }
 
    if(!validator.isEmail(email)){
      alert.show( "invalid email address" )
     validation_error = true

    }


    if(validation_error) {return }
    

    try {
 

      const {data} = await axiosinstance.post(  signin_api  , {
        email: email,
        password: password,
      })
  
  
  
      if(data.error){   return  alert.show(data.mssg)   }
  



      alert.show("Signined In Successfully");
      navigateTo("/app/welcome"); 
    } catch (error) {
      console.error("Error message:", error.message);
      alert.show("Signin failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg  w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input  bg-[#0C0F15] text-neutral-200 ">
      {" "}
      {/* Increased width */}
      <h2 className="font-bold text-xl text-neutral-200">
        Welcome back to Loci
      </h2>
      <p className="text-neutral-300 text-lg max-w-sm mt-2">Signin to Loci</p>
      <div className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <button
          className="bg-zinc-900 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
          onClick={handleSubmit}
        >
          Sign in &rarr;
          <BottomGradient />
        </button>
        <div
          className="pt-4 flex justify-center cursor-pointer hover:text-blue-400 hover:shadow-lg"
          onClick={() => setSignin(true)}
        >
          Do not have an account? <BottomGradient />
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </div>
      
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
