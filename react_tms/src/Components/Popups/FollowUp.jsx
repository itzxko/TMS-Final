import React, { useEffect, useState } from "react";
import axiosClient from "../../axios";
import { TbTransfer } from "react-icons/tb";
import Loading from "../Loading/Loading"; // Ensure correct path

const FollowUp = ({ onClose, data, bumpCode, ticket_cde, isVisible }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "auto";
    }
    if (isVisible) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => {
      enableScroll();
    };
  }, [isVisible]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isVisible) {
    return null; // Do not render anything if the modal is not visible
  }

  if (loading) {
    return <Loading />; // Show loading component when loading is true
  }

  const bump = (code) => {
    axiosClient
      .post("/follow-up", {
        ticket_cde: code,
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="fixed top-0 left-0 flex items-center justify-center min-h-[100svh] w-full z-30 bg-black/50 font-figtree"
      id="container"
      onClick={(e) => {
        if (e.target.id === "container") onClose();
      }}
    >
      <div className="flex flex-col gap-6 items-center justify-center p-8 bg-[#FAF5FF] rounded-xl shadow-xl">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex items-center justify-center p-2 bg-[#f6edff] rounded-md">
            <TbTransfer className="text-xl" />
          </div>
          <div className="flex items-center justify-center w-full">
            <p className="text-xs font-normal">Follow up this ticket?</p>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
          <div
            className="flex items-center justify-center px-4 py-2 bg-[#2f2f2f] hover:bg-[#474747] rounded-md cursor-pointer shadow-xl ease-in-out duration-500"
            onClick={() => bump(bumpCode)}
          >
            <p className="text-xs font-normal text-white">Proceed</p>
          </div>
          <div
            className="flex items-center justify-center px-4 py-2 bg-[#FFFFFF] hover:bg-[#f2f2f2] rounded-md cursor-pointer shadow-xl ease-in-out duration-500"
            onClick={() => onClose()}
          >
            <p className="text-xs font-normal text-black">Cancel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUp;
