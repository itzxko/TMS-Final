import React, { useState, useEffect, useRef, act } from "react";
import axiosClient from "../axios";
import ImageModal from "./ImageModal";

import { LiaDownloadSolid } from "react-icons/lia";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { TiArrowLeft } from "react-icons/ti";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { PiImages } from "react-icons/pi";
import { TbBrandDatabricks } from "react-icons/tb";
import { MdAttachment } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { TiInfoLarge } from "react-icons/ti";

import Loading from "./Loading/Loading";

// This part is for the Admin Modal
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
  const [openEmployee, setOpenEmployee] = useState(false); // For the employee data
  const [activeDetails, setActiveDetails] = useState(false); // For the ticket details
  const [smallAttach, setSmallAttach] = useState(false); // For the attachment button
  const [ticket_assigned_to_name, setTicket_assigned_to_name] = useState(""); // For the assigned employee name
  const [images, setImages] = useState([]); // For the image attachments
  const [videos, setVideos] = useState([]); // For the video attachments
  const [documents, setDocuments] = useState([]); // For the document attachments
  const [fileIndex, setFileIndex] = useState(0); // For the navigation of the images and videos
  const [open, setOpen] = useState(0); // For the attachment button
  const [showImageModal, setShowImageModal] = useState(false); // For the image modal
  const [Id, set_id] = useState(""); // For the employee id
  const [_office_code, set_office_code] = useState(""); // For the office code
  const [selectedEmployee, setSelectedEmployee] = useState("Select Employee"); // For the selected employee
  const [loading, setLoading] = useState(true); // For loading state
  const [incompleteInput, setIncompleteInput] = useState(false); // For the incomplete input warning
  const allMedia = [...images, ...videos]; // Combine images and videos

  // This part is for the employee data
  const handleEmployee = () => {
    setOpenEmployee(!openEmployee);
  };
  // This part is for the image modal
  const imgmodal = () => {
    setShowImageModal(!showImageModal);
  };

  // This part is for the attachment button
  const handleAttachment = () => {
    setSmallAttach(!smallAttach);
  };

  // This part is for the navigation of the images and videos
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

  useEffect(() => {
    if (assigned_name !== null) {
      setSelectedEmployee(assigned_name);
    } else {
      setSelectedEmployee("Select Employee");
    }
  }, [assigned_name]);

  // This part is for the fetching of the employee data
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

  // This part is for the fetching of the employee data
  useEffect(() => {}, [Id, ticket_assigned_to_name, _office_code]);

  // This part is for the fetching of the images, videos, and documents
  useEffect(() => {
    setLoading(true);
    if (isVisible) {
      // Fetch images, videos, and documents
      const fetchImages = async () => {
        try {
          const res = await axiosClient.get(`get_images/` + ticket_cde);
          setImages(res.data.images);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
      const fetchVideos = async () => {
        try {
          const res = await axiosClient.get(`get_videos/` + ticket_cde);
          setVideos(res.data.videos);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      };
      const fetchDocuments = async () => {
        try {
          const res = await axiosClient.get(`get_documents/` + ticket_cde);
          setDocuments(res.data.documents);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      };

      Promise.all([fetchDocuments(), fetchVideos(), fetchImages()]).then(() => {
        setLoading(false);
      });
    }
  }, [isVisible]);

  // This part is for the escape key to close the modal
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

  // This part is for the scrolling of the document attachments
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

  //This part is for the navigation of the document attachments
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
            setActiveDetails(false);
          }
        }}
      >
        <div className="w-full lg:w-3/4 bg-[#FAF5FF] flex flex-col items-center justify-center p-8 md:p-10 rounded-xl shadow-xl">
          <div className="relative w-full flex items-center justify-center pb-2">
            <p className="text-xs font-semibold">Ticket Details</p>
            <div
              className="absolute left-0 p-2 hover:bg-gray-200 ease-in-out duration-500 rounded-md"
              onClick={() => onClose()}
            >
              <TiArrowLeft className="text-xl" />
            </div>
          </div>
          <div className="w-full flex flex-col-reverse lg:flex-row-reverse  justify-center items-start py-6 gap-4 lg:gap-12">
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="w-full flex flex-row gap-2 items-center justify-start py-4 px-1">
                <div className="p-2 bg-[#2f2f2f] rounded-full text-white shadow-xl">
                  <RiAttachment2 className="text-sm" />
                </div>
                <p className="text-xs font-semibold">Attachments Section</p>
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <div className=" flex item-center justify-start w-full py-2 px-1">
                  <p className="text-xs font-normal">Images and Videos</p>
                </div>
                {/*  This part is for the images and videos*/}
                {images.length > 0 || videos.length > 0 ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    {(() => {
                      {
                        /* If there are images or videos, render and mapped the media file */
                      }
                      const allMedia = [
                        ...images.map((file) => ({ type: "image", file })),
                        ...videos.map((file) => ({ type: "video", file })),
                      ];
                      const mediaFile = allMedia[fileIndex];
                      {
                        /* If the media file is an image, render the image */
                      }
                      if (mediaFile?.type === "image") {
                        return (
                          <div
                            className="w-full h-[320px] rounded-md overflow-hidden cursor-pointer"
                            onClick={imgmodal}
                          >
                            {/* Render the image file */}
                            <img
                              src={`http://localhost:8000/storage/${mediaFile.file}`}
                              className="w-full h-full object-cover object-center hover:scale-105 ease-in-out duration-500"
                              alt={`Image ${fileIndex}`}
                            />
                          </div>
                        );
                      }
                      {
                        /* If the media file is a video, render the video */
                      }
                      if (mediaFile?.type === "video") {
                        return (
                          <div className="w-full h-[320px] rounded-md overflow-hidden cursor-pointer">
                            <video
                              controls
                              className="w-full h-full object-cover object-center"
                            >
                              {/** Render the video file */}
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
                      {/* for mapping the documents such as PDF & DOCX*/}
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
                                    {/* Download the attached Documents */}
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
                    {/* This part is for the Left and Right buttons to navigate through through the document attachments*/}
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
              <div className="w-full flex flex-col justify-center items-center py-2">
                <div className="w-full flex items-center justify-start py-2">
                  <p className="text-xs font-normal">Previous Deny Reason</p>
                </div>

                <div className="w-full border border-gray-300 rounded-md overflow-hidden p-4 bg-[#f6edff]">
                  <textarea
                    name=""
                    className="outline-none text-xs font-normal scrollbar-hide w-full resize-none bg-[#f6edff]"
                    rows={2}
                    readOnly={true}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="w-full flex flex-row gap-2 items-center justify-start py-4 px-1">
                <div className="p-2 bg-[#2f2f2f] rounded-full text-white shadow-xl">
                  <TiInfoLarge className="text-sm" />
                </div>
                <p className="text-xs font-semibold">Information Section</p>
              </div>
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
                  {/* This part is for the description */}
                  <textarea
                    name=""
                    id=""
                    rows={12}
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
                  {/* This part is for the employee data */}
                  <p className="text-xs font-semibold text-gray-500">
                    {selectedEmployee}
                  </p>
                  {/* This part is for the selecting employee*/}
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
                  {/* This part is for the setting the data */}
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
            </div>
          </div>
          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <div className="flex items-center justify-start w-1/2">
              <p
                // This part is for the incomplete input warning
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
      {/* This part is for the image modal */}
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
