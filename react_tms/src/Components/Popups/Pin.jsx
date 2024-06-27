import React from "react";
import { TbMailCode } from "react-icons/tb";
function Pin({ isVisible, onClose }) {
  return (
    <div
      id="container"
      className="w-full fixed top-0 left-0 flex min-h-[100svh] items-center justify-center bg-black/50 font-dm"
    >
      <div className="bg-[#FAF5FF] p-8 rounded-xl flex flex-col items-center justify-center shadow-xl animate-shake">
        <div className="bg-[#f6edff] p-2 rounded-md">
          <TbMailCode className="text-xl" />
        </div>
        <div className="w-full flex flex-col gap-2 items-center justify-center pt-6">
          <p className="text-xs font-bold uppercase">Sent!</p>
          <p className="text-xs font-normal">Check your Email for the OTP!</p>
        </div>
        <div className="w-full flex items-center justify-center pt-4">
          <div
            className="w-full py-2 flex items-center justify-center bg-[#2f2f2f] rounded-md cursor-pointer hover:bg-[#474747] transition-colors duration-700"
            onClick={() => onClose(false)}
          >
            <p className="text-xs font-semibold text-white">Proceed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pin;
