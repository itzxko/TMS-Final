import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo.png"; // Importing logo image
import img from "../assets/main.png"; // Dummy profile Picture
import axiosClient from "../axios"; // Importing axiosClient for making API requests
import Loading from "./Loading/Loading"; // Import Loading Component

// React Icons
import { CgClose } from "react-icons/cg";
import { TbMenuDeep } from "react-icons/tb";
import { RiMenu4Fill, RiMenu5Fill } from "react-icons/ri";
import { PiArrowDownRightBold } from "react-icons/pi";
import { RiAddFill } from "react-icons/ri";
import { IoMenuOutline } from "react-icons/io5";
import useRole from "./customHooks/useRole";

function Navbar({ selectedRole, setShowUserForm }) {
  const [menu, setMenu] = useState(false); // Toggle Menu state
  const [name, setName] = useState([]); // State to store employee names
  const [logout, setLogout] = useState(false); // Logout state
  const role = useRole(); // Custom hook to get user role
  const navigate = useNavigate(); // Navigate function from react-router-dom

  // Function to toggle the menu
  const handleMenu = () => {
    setMenu(!menu);
  };

  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    setLogout(true);

    // API call to logout
    axiosClient
      .post("/logout")
      .then(() => {
        setTimeout(() => {
          // Clear local storage and navigate to home after logout
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          navigate("/");
          setLogout(false);
        }, 2000); // Delay to simulate loading or as needed
      })
      .catch((err) => console.log(err));
  };

  // Fetch employee job count on component mount
  useEffect(() => {
    if (role !== "admin") {
        return;
    }
      axiosClient
        .get("/getEmployeeJobs")
        .then((res) => {
          setName(res.data.data); // Set employee names from API response
        })
        .catch((err) => {
          console.log(err);
        });
    
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <>
      {/* Conditional rendering of loading spinner */}
      {logout === true ? <Loading /> : null}
      <div className="fixed w-full p-2 overflow-hidden font-dm z-[1]">
        {/* Navbar container */}
        <div
          className={
            selectedRole !== "user"
              ? "py-4 px-6 md:px-8 bg-[#FAF5FF] flex justify-between items-center rounded-lg"
              : "py-3 px-6 md:px-8 bg-[#FAF5FF] flex justify-between items-center rounded-lg"
          }
        >
          {/* Logo and system name */}
          <div className="flex justify-center items-center gap-2">
            <img src={Logo} alt="/" className="w-[26px]" />
            <p className="hidden md:block font-extrabold text-sm uppercase text-[#113e21]">
              Ticketing Management System
            </p>
            <p className="block md:hidden font-extrabold text-sm uppercase text-[#113e21]">
              TMS
            </p>
          </div>
          {/* Profile picture and menu toggle */}
          <div className="flex items-center justify-center gap-3 md:gap-5">
            {/* Create button for specific roles */}
            <div
              className={
                selectedRole === "user"
                  ? "flex flex-row bg-[#2f2f2f] hover:bg-[#474747] transition-all duration-500 text-white px-3 py-2 rounded-md cursor-pointer gap-1"
                  : "hidden"
              }
              onClick={(e) => {
                e.preventDefault();
                setShowUserForm(true); // Show user form on click
              }}
            >
              <RiAddFill className="text-md" />
              <p className="text-xs font-normal">Create</p>
            </div>
            {/* Profile picture and username */}
            <div className="flex flex-row gap-2 items-center justfy-center">
              <div className="bg-gray-200 w-[28px] h-[28px] rounded-full overflow-hidden">
                <img
                  src={img}
                  alt=""
                  className="object-cover object-center w-full h-full hover:scale-110 ease-in-out duration-500 cursor-pointer"
                />
              </div>
              {/* Display username on larger screens */}
              <div className="hidden md:flex items-center justify-center">
                <p className="text-xs font-semibold truncate">
                  {localStorage.getItem("username") || null}
                </p>
              </div>
              {/* Dropdown menu for user options */}
              <div className="hidden lg:flex flex-col items-end">
                {/* Menu toggle icon */}
                <div className="text-lg cursor-pointer" onClick={handleMenu}>
                  {!menu ? <IoMenuOutline /> : <RiMenu4Fill />}
                </div>
                {/* Dropdown menu items */}
                <div
                  className={
                    !menu
                      ? "hidden"
                      : "fixed top-[80px] bg-[#FAF5FF] flex flex-col items-center justify-center rounded-lg overflow-hidden shadow-lg"
                  }
                >
                  {/* User info and logout button */}
                  <div className="min-h-[60px] w-[180px] bg-[#FAF5FF] flex flex-col items-center justify-center px-6">
                    <div className="w-full flex flex-col py-4 items-center justify-center gap-2 border-b">
                      {/* User profile info */}
                      <img
                        src={img}
                        className="h-[60px] w-[60px] rounded-full"
                        alt=""
                      />
                      <div className="flex flex-col items-center justify-center w-full gap-1">
                        <p className="text-xs font-semibold truncate">
                          {localStorage.getItem("username")}
                        </p>
                        {/* User role */}
                        <div className="w-full flex items-center justify-center truncate">
                          <p className="text-[10px] font-semibold py-1 px-2 text-white bg-[#2f2f2f] rounded-md">
                            {localStorage.getItem("role")}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Logout button */}
                    <div
                      className="flex items-center justify-center gap-1 py-4 w-full cursor-pointer"
                      onClick={handleLogout}
                    >
                      <PiArrowDownRightBold className="text-md" />
                      <p className="text-xs font-normal line-clamp-1">
                        Sign Out
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Menu toggle icon for small screens */}
              <div
                className="flex lg:hidden justify-center items-center cursor-pointer"
                onClick={handleMenu}
              >
                {!menu ? (
                  <TbMenuDeep className="text-md md:text-lg" />
                ) : (
                  <CgClose className="text-md md:text-lg" />
                )}
              </div>
            </div>
            {/* Sidebar for small screens */}
          </div>
        </div>
      </div>
      {/* Sidebar for small screens */}
      <div
        className={
          menu === false
            ? "fixed left-[-100%] h-full min-w-[70vw] max-w-[70vw] bg-[#FAF5FF] z-[1] shadow ease-in-out duration-700 font-dm"
            : "fixed lg:hidden h-full min-w-[70vw] max-w-[70vw] left-0 bg-[#FAF5FF] z-[1] shadow-xl overflow-hidden ease-in-out duration-700 font-dm"
        }
      >
        {/* User info and role */}
        <div className="h-1/6 w-full bg-da bg-cover bg-center">
          <div className="flex flex-row items-end p-6 md:p-8 h-full w-full bg-gradient-to-t from-black via-gray-800/90 to-gray-700/75">
            <div className="flex items-end justify-start w-2/3">
              <div className="">
                <div className="h-[60px] min-w-[60px] rounded-full overflow-hidden">
                  <img
                    src={img}
                    alt="/"
                    className="h-[60px] w-[60px] object-cover object-center"
                  />
                </div>
              </div>
              {/* User info */}
              <div className="flex flex-col w-full px-4 py-2">
                <p className="text-white truncate text-xs font-semibold">
                  {localStorage.getItem("username") || null}
                </p>
                {/* User role */}
                <p className="text-white font-normal text-xs truncate">
                  {selectedRole}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Admin panel for admin role */}
        <div
          className={selectedRole === "admin" ? "w-full max-h-full" : "hidden"}
        >
          <div className="flex flex-col rounded-lg antialiased cursor-pointer overflow-hidden">
            {/* Employee list */}
            <div className="relative p-4 w-full flex flex-col justify-center items-center">
              {/* Table headers */}
              <div className="flex flex-row justify-between pt-2 w-full border-b">
                <div className="flex items-center w-1/2 justify-start gap-4 py-2 px-4">
                  <p className="text-xs font-bold text-gray-500 truncate">
                    Employee
                  </p>
                </div>
                <div className="flex items-center justify-end w-1/2 gap-4 py-1 px-4">
                  <p className="text-xs font-bold text-gray-500 truncate">
                    Jobs
                  </p>
                </div>
              </div>
              {/* Employee list */}
              <div className="w-full h-[68vh] pb-8">
                <div className="w-full h-full overflow-auto scrollbar-hide">
                  {/* Display employee names and job counts */}
                  {name.map((names, index) => (
                    <div
                      className="flex flex-row justify-between py-1 px-4 hover:bg-[#f6edff] ease-in-out duration-500 border-b"
                      key={index}
                    >
                      {/* Employee name */}
                      <div className="flex items-center justify-start w-1/2 gap-4 py-2">
                        <p className="text-xs font-bold text-[#113e21] truncate">
                          {names.username}
                        </p>
                      </div>
                      {/* Job count */}
                      <div className="flex items-center justify-end w-1/2 gap-4 py-2">
                        <p className="text-xs font-semibold text-[#113e21] truncate">
                          {names.job_count}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Logout button */}
        <div className="absolute bottom-0 w-full flex items-end justify-end p-4">
          <div
            className="bg-[#2f2f2f] text-white py-3 rounded-md ease-in-out duration-500 flex flex-row gap-1 items-center justify-center cursor-pointer w-full"
            onClick={handleLogout}
          >
            <PiArrowDownRightBold className="text-md" />
            <p className="text-xs font-normal">Sign Out</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
