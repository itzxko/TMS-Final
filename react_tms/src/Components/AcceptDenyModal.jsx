import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import Loading from "../Components/Loading/Loading"; //Loading Component
import ImageModal from "./ImageModal"; //Image Modal

//Icons
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LiaDownloadSolid } from "react-icons/lia";
import { RiAttachment2 } from "react-icons/ri";
import { MdAttachment } from "react-icons/md";
import { TiArrowLeft } from "react-icons/ti";
import { PiImages } from "react-icons/pi";

const AcceptDenyModal = ({
  isVisible,
  onClose,
  ticket_type,
  request_desc,
  requester_name,
  ticket_cde,
  ticket_desc_remarks,
  ticket_desc_findings,
  ticket_desc_replacement,
  ticket_status,
}) => {
  const containerRef = useRef(null);
  const [activeDetails, setActiveDetails] = useState(false);
  const [smallAttach, setSmallAttach] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const allMedia = [...images, ...videos];

  const imgmodal = () => {
    setShowImageModal(!showImageModal);
    console.log(showImageModal);
  };

  const handleAttachment = () => {
    setSmallAttach(!smallAttach);
    console.log(smallAttach);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
        setActiveDetails(false);
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
    }

    return () => {
      enableScroll();
    };
  }, [isVisible]);

  const handleSubmit = async (e) => {
    try {
      const response = await axiosClient.post("/acceptRequest", { ticket_cde });
      onClose();
      location.reload();
    } catch (error) {
      console.error(error);
    }
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

  if (!isVisible) return null;

  const hasImages = images.some((image) => {
    const extension = image.split(".").pop();
    return /\.(jpg|jpeg|png|gif)$/i.test(extension);
  });
  const hasVideos = images.some((video) => {
    const extension = video.split(".").pop();
    return /\.(mp4|mov|avi|mkv)$/i.test(extension);
  });

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
                                className="flex items-center justify-center py-2 px-3 min-w-[100px] max-w-[160px] bg-[#FFFFFF] rounded-md shadow-md ease-in-out duration-500 flex-shrink-0"
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
              <div className="w-full flex flex-row items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal">Ticket Type</p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500 truncate">
                      {ticket_type}
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
                    rows={6}
                    className="w-full bg-[#f6edff] text-gray-500 resize-none outline-none text-xs font-semibold scrollbar-hide"
                    value={request_desc}
                    readOnly={true}
                  ></textarea>
                </div>
              </div>
              <div className="py-2 w-full flex flex-col items-center justify-center">
                <div className="flex flex-row items-center justify-start w-full py-2 px-1">
                  <p className="text-xs font-normal">Findings</p>
                  <p className="text-xs font-semibold text-red-700">*</p>
                </div>
                <div className="w-full flex items-center justify-center p-4 bg-[#f6edff] rounded-md border border-gray-300">
                  <textarea
                    rows={3}
                    className="w-full bg-[#f6edff] resize-none outline-none text-xs font-normal scrollbar-hide"
                    value={ticket_desc_findings}
                    readOnly={true}
                  ></textarea>
                </div>
              </div>
              <div className="w-full py-2 flex flex-row gap-4 items-center justify-center">
                <div className="w-1/2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-start w-full py-2 px-1">
                    <p className="text-xs font-normal">Actions/Remarks</p>
                    <p className="text-xs font-semibold text-red-700">*</p>
                  </div>
                  <div className="w-full flex items-center justify-center p-4 bg-[#f6edff] rounded-md border border-gray-300">
                    <textarea
                      rows={2}
                      className="w-full bg-[#f6edff] resize-none outline-none text-xs font-normal scrollbar-hide"
                      value={ticket_desc_remarks}
                      readOnly={true}
                    ></textarea>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-start w-full py-2 px-1">
                    <p className="text-xs font-normal">Replacement</p>
                    <p className="text-xs font-semibold text-red-700">*</p>
                  </div>
                  <div className="w-full flex items-center justify-center p-4 bg-[#f6edff] rounded-md border border-gray-300">
                    <textarea
                      rows={2}
                      className="w-full bg-[#f6edff] resize-none outline-none text-xs font-normal scrollbar-hide"
                      value={ticket_desc_replacement}
                      readOnly={true}
                    ></textarea>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="w-full flex flex-row gap-2 items-center justify-between py-4">
            <div className="flex flex-row gap-2 items-center justify-end w-full">
              {ticket_status === "5" ? (
                <div
                  className="flex items-center justify-center py-2 px-4 bg-[#FFFFFF] hover:bg-[#f2f2f2] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                  onClick={() => {
                    setShowImageModal(false);
                    onClose();
                    setActiveDetails(false);
                  }}
                >
                  <p className="text-xs font-normal text-black truncate">
                    Cancel
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center justify-center py-2 px-4 bg-[#2f2f2f] hover:bg-[#474747] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                    onClick={handleSubmit}
                  >
                    <p className="text-xs font-normal text-white truncate">
                      Accept
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center py-2 px-4 bg-[#2f2f2f] hover:bg-[#474747] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                    onClick={() => {
                      setShowImageModal(false);
                      onClose();
                      setActiveDetails(false);
                    }}
                  >
                    <p className="text-xs font-normal text-white truncate">
                      Deny
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center py-2 px-4 bg-[#FFFFFF] hover:bg-[#f2f2f2] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                    onClick={() => {
                      setShowImageModal(false);
                      onClose();
                      setActiveDetails(false);
                    }}
                  >
                    <p className="text-xs font-normal text-black truncate">
                      Cancel
                    </p>
                  </div>
                </>
              )}
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

export default AcceptDenyModal;