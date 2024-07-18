import { useState, useEffect, useRef } from "react";
import axiosClient from "../axios";
import Loading from "../Components/Loading/Loading"; //Loading Component
import ImageModal from "./ImageModal"; //Image Modal

//Icons
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LiaDownloadSolid } from "react-icons/lia";
import { RiAttachment2 } from "react-icons/ri";
import { TiInfoLarge } from "react-icons/ti";
import { MdAttachment } from "react-icons/md";
import { TiArrowLeft } from "react-icons/ti";
import { PiImages } from "react-icons/pi";

const TechModal = ({
  isVisible,
  onClose,
  ticket_type,
  request_desc,
  ticketID,
  requester_name,
  ticket_cde,
  ticket_desc_remarks,
  ticket_desc_findings,
  ticket_desc_replacement,
  property_no,
}) => {
  const containerRef = useRef(null);
  const [activeDetails, setActiveDetails] = useState(false);
  const [findings, setFindings] = useState("");
  const [actions, setActions] = useState("");
  const [replacement, setReplacement] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [fileIndex, setFileIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [incompleteInput, setIncompleteInput] = useState(false);
  const allMedia = [...images, ...videos];
  const [itemDesc, setItemDesc] = useState("");
  const [item, setItem] = useState("");

  // Function to toggle image modal visibility
  const imgmodal = () => {
    setShowImageModal(!showImageModal);
  };

  // Effect to handle Escape key press for closing modal
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

  // Effect to disable/enable scrolling when modal is visible/hidden
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

  // Effect to fetch ticket details when ticketID changes
  useEffect(() => {
    if (ticketID) {
      axiosClient
        .get(`/techShow/${ticketID}`)
        .then((res) => {
          if (res.data) {
            setFindings(ticket_desc_findings || "");
            setActions(ticket_desc_remarks || "");
            setReplacement(ticket_desc_replacement || "");
          } else {
            console.error("No data returned");
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    }
  }, [ticketID]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    if (replacement === "" || findings === "" || actions === "") {
      setIncompleteInput(true);
      setTimeout(() => {
        setIncompleteInput(false);
      }, 3000);
      return;
    }

    e.preventDefault();

    const formData = new FormData();
    formData.append("id", ticketID);
    formData.append("ticket_desc_findings", findings);
    formData.append("ticket_desc_remarks", actions);
    formData.append("ticket_desc_replacement", replacement);

    try {
      const response = await axiosClient.post("/techUpdate", formData);
      onClose();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle next media file
  const handleNext = () => {
    let newIndex = fileIndex + 1;
    if (newIndex >= allMedia.length) {
      newIndex = 0; // Loop back to the first file
    }
    setFileIndex(newIndex);
  };

  // Function to handle previous media file
  const handlePrevious = () => {
    let newIndex = fileIndex - 1;
    if (newIndex < 0) {
      newIndex = allMedia.length - 1; // Loop back to the last file
    }
    setFileIndex(newIndex);
  };

  // Effect to fetch images, videos, and documents when modal is visible
  useEffect(() => {
    setLoading(true);
    if (isVisible) {
      const fetchItemData = async () => {
        try {
          const response = await axiosClient.get(
            `/getItemByProperty/${property_no}`
          );
          const { Message } = response.data.data;
          if (Message) {
            const { CDE_ARTICLE, DESC_ARTICLE } = Message;
            setItem(CDE_ARTICLE);
            setItemDesc(DESC_ARTICLE);
          }
        } catch (err) {
          console.log(err);
        }
      };
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

      Promise.all([
        fetchDocuments(),
        fetchVideos(),
        fetchImages(),
        fetchItemData(),
      ]).then(() => {
        setLoading(false);
      });
    }
  }, [isVisible]);

  if (!isVisible) return null; // Return null if modal is not visible

  if (loading) {
    return <Loading />; // Show loading component while fetching data
  }

  return (
    // Modal Container
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
        {/* Modal Content */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-[#FAF5FF] flex flex-col items-start justify-center p-8 md:p-10 rounded-xl shadow-xl">
          <div className="relative w-full flex items-center justify-center pb-2 md:pb-6">
            <p className="text-xs font-semibold">Ticket Details</p>

            <div
              className="absolute left-0 p-2 hover:bg-gray-200 ease-in-out duration-500 rounded-md"
              onClick={() => onClose()}
            >
              <TiArrowLeft className="text-xl" />
            </div>
          </div>

          {/* if activeDetails is false, render the ticket type, requester, and description */}
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
                {/* If there are images or videos, render the media file */}
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
                            className="w-full h-[420px] rounded-md overflow-hidden cursor-pointer"
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
                          <div className="w-full h-[420px] rounded-md overflow-hidden cursor-pointer">
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
                        <div className="w-full min-h-[420px] bg-[#f6edff] rounded-md flex flex-col items-center justify-center border border-gray-300">
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
            </div>
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="w-full flex flex-row gap-2 items-center justify-start py-4 px-1">
                <div className="p-2 bg-[#2f2f2f] rounded-full text-white shadow-xl">
                  <TiInfoLarge className="text-sm" />
                </div>
                <p className="text-xs font-semibold">Information Section</p>
              </div>
              <div className="w-full flex flex-row gap-4 items-center justify-center py-2">
                <div className="w-2/4 flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal truncate">Ticket Type</p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500 truncate">
                      {ticket_type}
                    </p>
                  </div>
                </div>
                <div className="w-2/4 flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal truncate">Requester</p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500 truncate">
                      {requester_name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-4 items-center justify-center py-2">
                <div className="w-2/4 flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal truncate">
                      Property Number
                    </p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500 truncate">
                      {property_no}
                    </p>
                  </div>
                </div>
                <div className="w-2/4 flex flex-col items-center justify-center">
                  <div className="py-2 px-1 flex flex-row items-center justify-start w-full">
                    <p className="text-xs font-normal truncate">Item</p>
                  </div>
                  <div className="px-4 py-3 bg-[#f6edff] w-full flex items-center justify-center border border-gray-300 rounded-md">
                    <p className="text-xs font-semibold text-gray-500 truncate">
                      {item}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center py-2">
                <div className="flex justify-start items-center w-full py-2">
                  <p className="text-xs font-normal">Item Description</p>
                </div>
                <div className="p-4 rounded-md bg-[#f6edff] w-full border border-gray-300">
                  <textarea
                    name=""
                    id=""
                    rows={4}
                    className="outline-none bg-[#f6edff] w-full resize-none text-xs font-normal scrollbar-hide"
                    value={itemDesc}
                    readOnly={true}
                  ></textarea>
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
                    rows={8}
                    className="w-full bg-[#f6edff] text-gray-500 resize-none outline-none text-xs font-semibold scrollbar-hide"
                    value={request_desc}
                    readOnly={true}
                  ></textarea>
                </div>
              </div>
              {/* Render the findings, actions, and replacement fields */}
              <div className="py-2 w-full flex flex-col items-center justify-center">
                <div className="flex flex-row items-center justify-start w-full py-2 px-1">
                  <p className="text-xs font-normal">Findings</p>
                  <p className="text-xs font-semibold text-red-700">*</p>
                </div>
                <div className="w-full flex items-center justify-center p-4 bg-[#f6edff] rounded-md border border-gray-300">
                  <textarea
                    name=""
                    id=""
                    rows={3}
                    className="w-full bg-[#f6edff] resize-none outline-none text-xs font-normal scrollbar-hide"
                    placeholder="Enter findings here..."
                    value={findings}
                    onChange={(e) => setFindings(e.target.value)}
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
                      name=""
                      id=""
                      rows={2}
                      className="w-full bg-[#f6edff] resize-none outline-none text-xs font-normal scrollbar-hide"
                      placeholder="Actions or Remarks"
                      value={actions}
                      onChange={(e) => setActions(e.target.value)}
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
                      name=""
                      id=""
                      rows={2}
                      className="w-full bg-[#f6edff] resize-none outline-none text-xs font-normal scrollbar-hide"
                      placeholder="Replacement"
                      value={replacement}
                      onChange={(e) => setReplacement(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Render the Proceed and Cancel buttons */}
          <div className="w-full flex flex-row gap-2 items-center justify-between">
            <div className="flex items-center justify-start w-1/2">
              {incompleteInput === true ? (
                <p className="text-xs font-semibold text-red-700 animate-shake line-clamp-1">
                  Fill the Required Fields!
                </p>
              ) : null}
            </div>
            <div className="flex flex-row gap-2 items-center justify-end w-1/2">
              <div
                className="flex items-center justify-center py-2 px-4 bg-[#2f2f2f] hover:bg-[#474747] ease-in-out duration-500 rounded-md shadow-xl cursor-pointer"
                onClick={handleSubmit}
              >
                <p className="text-xs font-normal text-white truncate">
                  Proceed
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
            </div>
          </div>
        </div>
      </div>

      {/* condition and props for the ImageModal */}
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

export default TechModal;
