import React from "react";
import { useState } from 'react'
import {
  MdOutlinePersonOutline,
  MdOutlineLock,
  MdOutlineAlternateEmail,
  MdFormatListNumbered,
  MdOutlineWorkOutline,
} from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import axiosClient from "../axios";

const Signup = () => {
  // State variables for form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPassword_Confimation] = useState('')
  const [username, setUserName] = useState('')
  const [emp_no, setEmpNo] = useState('')
  const [position_id, setPositionID] = useState('')
  const [office_code, setOfficeCode] = useState('')
  const navigate = useNavigate();

  // Function to handle form submission
  const submit = (e) => {
    e.preventDefault();
    // Make a POST request to register a new user
    axiosClient.post('/register', {
          username: username,
          email: email,
          password: password,
          password_confirmation: password_confirmation,
          emp_no: emp_no,
          position_id: position_id,
          office_code: office_code,
        })
        .then(() => {
            console.log("Signup successful");
            navigate ("/");
        })
        .catch(error => {
          if (error.response.status === 401) {
            console.log("Unauthorized access");
          } else {
            console.error("Error:", error);
          }
        });
  }
  
  return (
    <>
    <form action="" onSubmit={submit}>
      {/* Background container */}
      <div className="bg-main flex h-full bg-cover w-full bg-center">
        <div className="bg-gradient-to-t from-black/75 via-gray-900/75 to-gray-600/75 flex h-full bg-cover w-full font-montserrat justify-center items-center">
          {/* Padding container */}
          <div className="flex py-28 px-10 justify-center items-center">
            {/* White form container */}
            <div className="bg-white/75 py-16 px-16 rounded-md lg:rounded-lg shadow-lg">
              {/* Signup headers */}
              <div className="flex flex-col">
                <p className="text-sm">SIGN UP</p>
                <p className="text-xl md:text-4xl text-teal-700 font-bold">
                  CREATE ACCOUNT
                </p>
              </div>
              {/* Username input */}
              <div className="pt-12 pb-2 border-b-[1px] border-black">
                <div className="pt-3 flex flex-row gap-4 items-center">
                  <MdOutlinePersonOutline className="text-xl md:text-2xl" />
                  <input
                    type="text"
                    className="bg-white/0 outline-none text-md font-semibold w-full placeholder-black/50 pr-2"
                    placeholder="User Name"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>
              {/* Email input */}
              <div className="pt-6 pb-2 border-b-[1px] border-black">
                <div className="pt-3 flex flex-row gap-4 items-center">
                  <MdOutlineAlternateEmail className="text-xl md:text-2xl" />
                  <input
                    type="text"
                    className="bg-white/0 outline-none text-md font-semibold w-full placeholder-black/50 pr-2"
                    placeholder="Email Address"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* Password input */}
              <div className="pt-6 pb-2 border-b-[1px] border-black">
                <div className="pt-3 flex flex-row gap-4 items-center">
                  <MdOutlineLock className="text-xl md:text-2xl" />
                  <input
                    type="password"
                    className="bg-white/0 outline-none text-md font-semibold w-full placeholder-black/50 pr-2"
                    placeholder="Password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {/* Confirm password input */}
              <div className="pt-6 pb-2 border-b-[1px] border-black">
                <div className="pt-3 flex flex-row gap-4 items-center">
                  <MdOutlineLock className="text-xl md:text-2xl" />
                  <input
                    type="password"
                    className="bg-white/0 outline-none text-md font-semibold w-full placeholder-black/50 pr-2"
                    placeholder="Re-enter Password"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => setPassword_Confimation(e.target.value)}
                  />
                </div>
              </div>
              {/* Position ID input */}
              <div className="pt-6 pb-2 border-b-[1px] border-black">
                <div className="pt-3 flex flex-row gap-4 items-center">
                  <MdOutlineWorkOutline className="text-xl md:text-2xl" />
                  <input
                    type="text"
                    className="bg-white/0 outline-none text-md font-semibold w-full placeholder-black/50 pr-2"
                    placeholder="Position ID"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => setPositionID(e.target.value)}
                  />
                </div>
              </div>
              {/* Office Code input */}
              <div className="pt-6 pb-2 border-b-[1px] border-black">
                <div className="pt-3 flex flex-row gap-4 items-center">
                  <HiOutlineOfficeBuilding className="text-xl md:text-2xl" />
                  <input
                    type="text"
                    className="bg-white/0 outline-none text-md font-semibold w-full placeholder-black/50 pr-2"
                    placeholder="Office Code"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => setOfficeCode(e.target.value)}
                  />
                </div>
              </div>
              {/* Signup button */}
              <button className="px-4 py-2 bg-teal-700 text-white font-semibold uppercase mt-12 rounded shadow-lg text-md hover:bg-gray-900 hover:text-white ease-in-out duration-700 " type='submit'>
                Sign Up
              </button>
              {/* Link to login page */}
              <div className="flex flex-col lg:flex-row gap-0 lg:gap-2 py-4">
                <p className="text-black font-normal ">
                  Already have an account?
                </p>
                <Link
                  to="/"
                  path="/"
                  className="font-bold text-teal-800 cursor-pointer tracking-wider hover:text-black ease-in-out duration-500"
                >
                  LOG IN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  );
};

export default Signup;
