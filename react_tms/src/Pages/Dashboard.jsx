import React from "react";
import Navbar from "../Components/Navbar";
import Small from "../Components/Dashboard/Small";
import Large from "../Components/Dashboard/Large";
import { useState } from "react";
const Dashboard = () => {
  //Render Page

  return (
    <>
      <Small className="block lg:hidden" />
      <Large className="hidden lg:block" />
    </>
  );
};

export default Dashboard;
