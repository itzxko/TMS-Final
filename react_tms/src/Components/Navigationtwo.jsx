import React from "react";
import logo from '../assets/logo.png';


function Navigationtwo() {
  return (
    <>
      <div className="fixed w-full bg-[#f3fbfb] px-6 md:px-8 lg:px-10 overflow-hidden font-figtree z-[1] shadow-sm">
        <div className="py-4 flex justify-between items-center">
          {/* logo and system name */}
          <div className="flex justify-center items-center gap-4">
            <img src={logo} alt="Logo" className="w-[30px]" />
            <p className="hidden md:block font-bold text-md uppercase text-[#113e21]">
              Ticketing Management System.
            </p>
            <p className="block md:hidden font-bold text-md uppercase text-[#113e21]">
              TMS.
            </p>
          </div>
          {/* profile picture and menu burger */}
          <div className="flex items-center justify-center gap-4">
            
      
              <p className="text-md font-semibold">TICKET ID: 12314141231</p>
           
            
            <div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigationtwo;