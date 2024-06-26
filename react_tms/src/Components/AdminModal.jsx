import React, { useState, useEffect, useRef, act } from "react";
import axiosClient from "../axios";
import ImageModal from "./ImageModal";

import { LiaDownloadSolid } from "react-icons/lia";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { RiAttachment2 } from "react-icons/ri";
import { TiArrowLeft } from "react-icons/ti";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { PiImages } from "react-icons/pi";
import { TbBrandDatabricks } from "react-icons/tb";
import { MdAttachment } from "react-icons/md";

import Loading from "./Loading/Loading";

const AdminModal = ({
  isVisible,
  onClose,
  ticket_type,
  request_desc,
  assigned_name,
  data,
  id,
  selected,
  name_requester,
  ticket_cde,
}) => {
  const containerRef = useRef(null);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [activeDetails, setActiveDetails] = useState(false);
  const [smallAttach, setSmallAttach] = useState(false);
  const [ticket_assigned_to_name, setTicket_assigned_to_name] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [open, setOpen] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [Id, set_id] = useState("");
  const [_office_code, set_office_code] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("Select Employee");
  const [loading, setLoading] = useState(true);
  const [incompleteInput, setIncompleteInput] = useState(false);
  const allMedia = [...images, ...videos];

  const handleEmployee = () => {
    setOpenEmployee(!openEmployee);
  };

  const imgmodal = () => {
    setShowImageModal(!showImageModal);
    console.log(setShowImageModal);
  };

  const handleAttachment = () => {
    setSmallAttach(!smallAttach);
    console.log(smallAttach);
  };

  const handleNext = () => {
    let newIndex = fileIndex + 1;
    if (newIndex >= allMedia.length) {
      newIndex = 0; // Loop back to the first file
    }
    setFileIndex(newIndex);
  };

  const handlePrevious = () => {
    let newIndex = fileIndex - 1;
    if (newIndex < 0) {
      newIndex = allMedia.length - 1; // Loop back to the last file
    }
    setFileIndex(newIndex);
  };

  const handleOpen = (value) => {
    setOpen(value);
    setFileIndex(0);
    setShowImageModal(true);
  };

  useEffect(() => {
    if (assigned_name !== null) {
      setSelectedEmployee(assigned_name);
    } else {
      setSelectedEmployee("Select Employee");
    }
  }, [assigned_name]);

  const updateTicket = () => {
    if (!selectedEmployee || selectedEmployee === "Select Employee") {
      setIncompleteInput(true);
      setTimeout(() => {
        setIncompleteInput(false);
      }, 3000);
      return;
    }

    axiosClient
      .post("assign_request/" + id, {
        ticket_assigned_to_id: Id,
        ticket_assigned_to_name: ticket_assigned_to_name,
        ticket_office_code: _office_code,
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {}, [Id, ticket_assigned_to_name, _office_code]);

  useEffect(() => {
    setLoading(true);
    if (isVisible) {
      const fetchImages = async () => {
        try {
          const res = await axiosClient.get(`get_images/` + ticket_cde);
          setImages(res.data.images);
          console.log(res.data.images);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
      const fetchVideos = async () => {
        try {
          const res = await axiosClient.get(`get_videos/` + ticket_cde);
          setVideos(res.data.videos);
          console.log(res.data.videos);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      };
      const fetchDocuments = async () => {
        try {
          const res = await axiosClient.get(`get_documents/` + ticket_cde);
          setDocuments(res.data.documents);
          console.log(res.data.documents);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      };

      Promise.all([fetchDocuments(), fetchVideos(), fetchImages()]).then(() => {
        setLoading(false);
      });
    }
  }, [isVisible]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setActiveDetails(false);
        setShowImageModal(false);
        selected(null);
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "auto";
    };

    if (isVisible) {
      disableScroll();
    } else {
      enableScroll();
      setOpen(0);
    }

    return () => {
      enableScroll();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleScrollLeft = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= scrollOffset;
    }
  };
  const handleScrollRight = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  };

  //added loading to fully load the data from storage so that it won't cause some issues
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-[100svh] items-center justify-center bg-black/50 flex z-10 font-figtree">
      <div
        className="w-full min-h-[100svh] max-h-[100svh] py-12 px-4 overflow-auto flex justify-center items-start"
        id="container"
        onClick={(e) => {
          if (e.target.id === "container") {
            onClose();
            selected(null);
            setActiveDetails(false);
          }
        }}
      >
        <div className="w-full md:w-2/3 lg:w-1/3 bg-[#FAF5FF] flex flex-col items-center justify-center p-8 md:p-10 rounded-xl shadow-xl">
          <div className="relative w-full flex items-center justify-center pb-2 md:pb-12">
            <p className="text-xs font-semibold">Ticket Details</p>
            <div
              className={
                !activeDetails
                  ? "absolute right-0 bg-[FAF5FF] p-2 cursor-pointer text-black"
                  : "absolute right-0 bg-[#2f2f2f] p-2 cursor-pointer text-white rounded-md"
              }
              onClick={() => setActiveDetails(!activeDetails)}
            >
              <MdAttachment className="text-md" />
            </div>
            <div
              className="absolute left-0 p-2 hover:bg-gray-200 ease-in-out duration-500 rounded-md"
              onClick={() => onClose()}
            >
              <TiArrowLeft className="text-xl" />
            </div>
          </div>
          {/* insert the argument here */}

          {activeDetails ? (
            <>
              <div className="w-full flex flex-col items-center justify-center py-4">
                <div className=" flex item-center justify-start w-full py-2 px-1">
                  <p className="text-xs font-normal">Images and Videos</p>
                </div>
                {images.length > 0 || videos.length > 0 ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {(() => {
                      const allMedia = [
                        ...images.map((file) => ({ type: "image", file })),
                        ...videos.map((file) => ({ type: "video", file })),
                      ];
                      const mediaFile = allMedia[fileIndex];

                      if (mediaFile?.type === "image") {
                        return (
                          <div
                            className="w-full h-[260px] rounded-md overflow-hidden cursor-pointer"
                            onClick={imgmodal}
                          >
                            <img
                              src={`http://localhost:8000/storage/${mediaFile.file}`}
                              className="w-full h-full object-cover object-center hover:scale-105 ease-in-out duration-500"
                              alt={`Image ${fileIndex}`}
                            />
                          </div>
                        );
                      }

                      if (mediaFile?.type === "video") {
                        return (
                          <div className="w-full h-[260px] rounded-md overflow-hidden cursor-pointer">
                            <video
                              controls
                              className="w-full h-full object-cover object-center"
                            >
                              <source
                                src={`http://localhost:8000/storage/${mediaFile.file}`}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        );
                      }

                      // If the file is neither an image nor a video, render "No media file" message
                      return (
                        <div className="w-full min-h-[260px] bg-[#f6edff] rounded-md flex flex-col items-center justify-center border border-gray-300">
                          <PiImages className="text-xl" />
                          <p className="text-xs font-normal">No media file</p>
                        </div>
                      );
                    })()}
                    <div className="absolute flex flex-row items-center justify-between w-full gap-2 py-4">
                      <button
                        className="text-[#2f2f2f] p-2 rounded-md hover:text-white ease-in-out duration-500"
                        onClick={handlePrevious}
                      >
                        <FaAngleLeft className="text-xl" />
                      </button>
                      <button
                        className="text-[#2f2f2f] p-2 rounded-md hover:text-white ease-in-out duration-500"
                        onClick={handleNext}
                      >
                        <FaAngleRight className="text-xl" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full min-h-[260px] bg-[#f6edff] rounded-md flex flex-col items-center justify-center border border-gray-300">
                    <PiImages className="text-xl" />
                    <p className="text-xs font-normal">No media file</p>
                  </div>
                )}
              </div>
              <div className="w-full flex flex-col items-center justify-center py-4">
                <div className="w-full flex items-center justify-start py-2 px-1">
                  <p className="text-xs font-normal">Documents</p>
                </div>
                <div className=" relative w-full flex items-center group">
                  <div className="flex w-full items-center overflow-hidden">
                    <div
                      className="flex flex-row gap-2 items-center py-2 overflow-x-auto scrollbar-hide w-full"
                      ref={containerRef}
                    >
                      {documents.length > 0 ? (
                        documents.map((file, index) => {
                          const fileName = file.split("/").pop();

                          const isDocument = /\.(pdf|docx|doc)$/i.test(file);

                          if (isDocument) {
                            return (
                              <div
                                className="flex items-center justify-center py-2 px-3 min-w-[100px] max-w-[160px] bg-[#FFFFFF] rounded-md shadow-md cursor-pointer ease-in-out duration-500 flex-shrink-0"
                                key={index}
                              >
                                <p className="text-xs font-normal truncate pr-2">
                                  {fileName}
                                </p>
                                <div className="pl-2 border-l object-cover flex items-center">
                                  <a
                                    href={`http://localhost:8000/storage/${file}`}
                                    download={fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <LiaDownloadSolid
                                      className="text-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    />
                                  </a>
                                </div>
                              </div>
                            );
                          }

                          // If the file is not a document, return null to not render anything
                          return null;
                        })
                      ) : (
                        <div className="w-full min-h-[40px] bg-[#f6edff] rounded-md flex flex-row items-center justify-center border border-gray-300">
                          <RiAttachment2 className="text-md" />
                          <p className="text-xs font-normal">No Documents</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="absolute right-[-16px] bg-gray-200/0 hover:bg-gray-200 rounded-md p-2 cursor-pointer ease-in-out duration-500"
                    onClick={() => handleScrollRight(160)}
                  >
                    <FaAngleRight className="text-black/0 group-hover:text-black ease-in-out duration-500" />
                  </div>
                  <div
                    className="absolute left-[-16px] bg-gray-200/0 hover:bg-gray-200 rounded-md p-2 cursor-pointer ease-in-out duration-500"
                    onClick={() => handleScrollLeft(160)}
                  >
                    <FaAngleLeft className="text-black/0 group-hover:text-black ease-in-out duration-500" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex flex-row gap-6 items-center justify-center py-2">
                <div className="w-1/2 flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal">Ticket Type</p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500">
                      {ticket_type}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal">Requester</p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500">
                      {name_requester}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-2 w-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-start w-full py-2 px-1">
                  <p className="text-xs font-normal">Description</p>
                </div>
                <div className="w-full flex items-center justify-center p-4 bg-[#f6edff] rounded-md border border-gray-300">
                  <textarea
                    name=""
                    id=""
                    rows={6}
                    className="w-full bg-[#f6edff] resize-none outline-none text-xs font-semibold scrollbar-hide text-gray-500"
                    value={request_desc}
                    readOnly={true}
                  ></textarea>
                </div>
              </div>
              <div className="relative w-full flex flex-col items-center justify-center py-2">
                <div className="w-full flex flex-row items-center justify-start py-2 px-1">
                  <p className="text-xs font-normal">Assign to Employee</p>
                  <p className="text-xs font-semibold text-red-700">*</p>
                </div>
                <div
                  className="relative w-full flex items-center justify-between px-4 py-3 bg-[#f6edff] rounded-md border border-gray-300"
                  onClick={handleEmployee}
                >
                  <p className="text-xs font-semibold text-gray-500">
                    {selectedEmployee}
                  </p>
                  {!openEmployee ? (
                    <RiArrowDropDownLine className="text-xl" />
                  ) : (
                    <RiArrowDropUpLine className="text-xl" />
                  )}
                </div>
                <div
                  className={
                    !openEmployee
                      ? "hidden"
                      : "absolute top-[100px] w-full bg-[#f6edff] rounded-md border border-gray-300 overflow-hidden shadow-xl z-10"
                  }
                >
                  {data.map((data) => (
                    <div
                      className="py-2 px-4 w-full border-b border-gray-300 cursor-pointer"
                      key={data.emp_no}
                      onClick={() => {
                        setSelectedEmployee(data.username);
                        set_id(data.emp_no);
                        set_office_code(data.office_code);
                        setTicket_assigned_to_name(data.username);
                        setOpenEmployee(false);
                      }}
                    >
                      <p className="text-xs font-normal truncate">
                        {data.username}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="w-full flex flex-row gap-2 items-center justify-between py-4">
            <div className="flex items-center justify-start w-1/2">
              <p
                className={
                  incompleteInput
                    ? "text-xs font-semibold text-red-700 animate-shake line-clamp-1"
                    : "hidden"
                }
              >
                Fill the Required Fields!
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center justify-end w-1/2">
              <div
                className="flex items-center justify-center py-2 px-4 bg-[#2f2f2f] hover:bg-[#474747] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                onClick={updateTicket}
              >
                <p className="text-xs font-normal text-white truncate">
                  Proceed
                </p>
              </div>
              <div
                className="flex items-center justify-center py-2 px-4 bg-[#FFFFFF] hover:bg-[#f2f2f2] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                onClick={() => {
                  setShowImageModal(false);
                  selected(null);
                  onClose();
                  setActiveDetails(false);
                }}
              >
                <p className="text-xs font-normal text-black truncate">
                  Cancel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageModal && (
        <ImageModal
          isVisible={showImageModal}
          onClose={() => setShowImageModal(false)}
          images={images}
          fileIndex={fileIndex}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default AdminModal;
