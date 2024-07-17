import React from "react";

import { TiArrowLeft } from "react-icons/ti";
import { FaRegLightbulb } from "react-icons/fa";

const UserAccept = ({ isVisible, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-[100svh] items-center justify-center bg-black/50 flex z-10 font-dm">
      <div
        className="w-full min-h-[100svh] max-h-[100svh] py-12 px-4 overflow-auto flex justify-center items-center"
        id="container"
        onClick={(e) => {
          if (e.target.id === "container") {
            onClose();
          }
        }}
      >
        {/* Modal content */}
        <div className="w-full md:w-2/4 lg:w-1/4 bg-[#FAF5FF] flex flex-col items-center justify-center p-8 md:p-10 rounded-xl shadow-xl">
          <div className="relative w-full flex items-center justify-center pb-4">
            <div className="w-full flex flex-row gap-2 items-center justify-center">
              <div className="p-2 bg-[#2f2f2f] rounded-full">
                <FaRegLightbulb className="text-xs text-white" />
              </div>
              <p className="text-xs font-semibold truncate">Feedback</p>
            </div>
            <div className="absolute left-0 top-0">
              <TiArrowLeft className="text-xl" />
            </div>
          </div>
          <div className="w-full flex items-center justify-center py-4">
            <div className="w-full flex items-center justify-center p-4 bg-[#f6edff] rounded-md border border-gray-300">
              <textarea
                type="text"
                className="w-full text-xs font-normal outline-none bg-[#f6edff] resize-none scrollbar-hide"
                rows={4}
                placeholder="provide comments and suggestions regarding the ticket"
              />
            </div>
          </div>
          <div className="w-full flex flex-row gap-2 items-center justify-end pt-4">
            <div className="py-2 px-4 bg-[#2f2f2f] rounded-md shadow-xl cursor-pointer hover:bg-[#474747] transition-colors duration-500">
              <p className="text-xs font-normal text-white cursor-pointer">
                Confirm
              </p>
            </div>
            <div
              className="py-2 px-4 bg-white rounded-md shadow-xl cursor-pointer hover:bg-[#f2f2f2] transition-colors duration-500"
              onClick={() => {}}
            >
              <p className="text-xs font-normal text-black cursor-pointer">
                Skip
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccept;
