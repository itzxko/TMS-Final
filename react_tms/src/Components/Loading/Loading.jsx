import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 flex min-h-[100svh] w-full items-center justify-center z-50 bg-/50 text-black bg-black/75">
      <div className="flex flex-row justify-center items-center gap-2">
        <div
          className="animate-pulse bg-[#f5faff] h-[8px] w-[8px] rounded-full"
          style={{ animationDelay: `${100}ms` }}
        ></div>
        <div
          className="animate-pulse bg-[#f5faff] h-[8px] w-[8px] rounded-full "
          style={{ animationDelay: `${200}ms` }}
        ></div>
        <div
          className="animate-pulse bg-[#f5faff] h-[8px] w-[8px] rounded-full "
          style={{ animationDelay: `${300}ms` }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;
