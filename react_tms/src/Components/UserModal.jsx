import React, { useState, useEffect } from "react";
import axiosClient from "../axios";
import { IoIosRemoveCircle } from "react-icons/io";
import { TbFaceIdError } from "react-icons/tb";
import Swal from "sweetalert2"; // npm install sweetalert2
// if you don't have it, then if there's error install npm legacy peer deps

import { TiArrowLeft } from "react-icons/ti";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { RiFileVideoLine } from "react-icons/ri";
import { MdOutlineBrokenImage } from "react-icons/md";
import { GrDocumentText } from "react-icons/gr";
import imageCompression from "browser-image-compression";
import Loading from "../Components/Loading/Loading";

const UserModal = ({ isVisible, onClose, data }) => {
  const [ticket_type, set_ticket_type] = useState("Select Ticket Type");
  const [ticket_if_others, set_ticket_if_others] = useState(null);
  const [ticket_desc_concern, set_ticket_desc_concern] = useState("");
  const [file, setFile] = useState([]);
  const [video, set_video] = useState([]);
  const [_document, set_document] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openType, setOpenType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incompleteInput, setIncompleteInput] = useState(false);
  const [limitError, setLimitError] = useState(false);

  const handleOpenType = () => {
    setOpenType(!openType);
    console.log(openType);
  };

  const handleFileRemove = (index, type) => {
    let updatedFiles = [];
    if (type === "image") {
      updatedFiles = [...file];
      updatedFiles.splice(index, 1);
      setFile(updatedFiles);
    } else if (type === "video") {
      updatedFiles = [...video];
      updatedFiles.splice(index, 1);
      set_video(updatedFiles);
    } else if (type === "document") {
      updatedFiles = [..._document];
      updatedFiles.splice(index, 1);
      set_document(updatedFiles);
    }
  };

  const renderSelectedFiles = (files, type) => {
    return files.map((file, index) => (
      <div key={index} className="flex items-center justify-between py-1">
        <p className="truncate">{file.name}</p>
        <button
          className="text-white hover:text-red-800"
          onClick={() => handleFileRemove(index, type)}
        >
          <IoIosRemoveCircle />
        </button>
      </div>
    ));
  };

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    const compressedFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        compressedFiles.push(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    }

    const convertedFiles = await Promise.all(
      compressedFiles.map(async (blob) => {
        const fileName = `${Date.now()}-${Math.round(
          Math.random() * 100000
        )}.jpg`;
        const convertedFile = new File([blob], fileName, { type: blob.type });
        return convertedFile;
      })
    );

    setFile((prevFiles) => [...prevFiles, ...convertedFiles]);
    setSelectedFiles(Array.from(selectedFiles));
  };

  const removeFile = (index) => {
    setFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setSelectedFiles((prevSelected) =>
      prevSelected.filter((_, i) => i !== index)
    );
  };

  const handleVideoChange = (e) => {
    const files = e.target.files;
    set_video((prev) => [...prev, ...Array.from(files)]);
  };

  const removeVideo = (index) => {
    set_video((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentsChange = (e) => {
    const files = e.target.files;
    set_document((prev) => [...prev, ...Array.from(files)]);
  };

  const removeDocument = (index) => {
    set_document((prevDocuments) =>
      prevDocuments.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ticket_desc_concern === "" || ticket_type === "Select Ticket Type") {
      setIncompleteInput(true);
      setTimeout(() => {
        setIncompleteInput(false);
      }, 3000);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("file[]", file[i]);
    }
    for (let i = 0; i < video.length; i++) {
      formData.append("video[]", video[i]);
    }
    for (let i = 0; i < _document.length; i++) {
      formData.append("documents[]", _document[i]);
    }

    formData.append("ticket_client_name", localStorage.getItem("username"));
    formData.append("ticket_type", ticket_type);
    formData.append("ticket_if_others", ticket_if_others);
    formData.append("ticket_desc_concern", ticket_desc_concern);

    try {
      await axiosClient.post("/add-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set_video([]);
      set_document([]);
      setFile([]);
      location.reload();
    } catch (error) {
      console.error(error);
      setLimitError(true);
      setTimeout(() => {
        setLimitError(false); 
      }, 3000);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
        setLimitError(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    setLoading(true);
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "auto";
    };

    if (isVisible) {
      setTimeout(() => {
        disableScroll();
        setLoading(false);
      }, 3000);
    } else {
      enableScroll();
    }

    return () => {
      enableScroll();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setFile([]);
      setSelectedFiles([]);
    }
  }, [isVisible]);

  if (!isVisible) return null;

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
          <div className="relative w-full flex items-center justify-center pb-6">
            <p className="text-sm font-semibold">New Ticket.</p>
            <div
              className="absolute left-0 p-2 hover:bg-gray-200 ease-in-out duration-500 rounded-md"
              onClick={() => onClose()}
            >
              <TiArrowLeft className="text-xl" />
            </div>
          </div>
          <div className="relative w-full flex flex-col items-center justify-center py-2">
            <div className="flex items-center justify-start py-2 px-1 w-full">
              <p className="text-xs font-normal">Ticket Type</p>
              <p className="text-xs font-semibold text-red-700">*</p>
            </div>
            <div
              className="px-4 py-3 w-full bg-[#f6edff] rounded-md border border-gray-300 flex items-center justify-between"
              onClick={handleOpenType}
            >
              <p className="text-xs font-semibold text-gray-500">
                {ticket_type}
              </p>
              {openType ? (
                <RiArrowDropUpLine className="text-xl" />
              ) : (
                <RiArrowDropDownLine className="text-xl" />
              )}
            </div>
            <div
              className={
                openType
                  ? "bg-[#f6edff] absolute top-[100px] w-full rounded-md border border-gray-300 overflow-hidden cursor-pointer shadow-xl"
                  : "hidden"
              }
            >
              {data.map((item) => (
                <div
                  key={item.ID}
                  className="py-2 w-full px-4 border-b"
                  onClick={() => {
                    set_ticket_type(item.TYPE_DESC);
                    setOpenType(false);
                  }}
                >
                  <p className="text-xs truncate">{item.TYPE_DESC}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center py-2">
            <div className="flex flex-row items-center justify-start w-full py-2 px-1">
              <p className="text-xs font-normal">Description</p>
              <p className="text-xs font-semibold text-red-700">*</p>
            </div>
            <div className="bg-[#f6edff] w-full p-4 rounded-md border border-gray-300">
              <textarea
                name=""
                id=""
                className="w-full outline-none resize-none bg-[#f6edff] text-xs scrollbar-hide"
                placeholder="describe your concern here..."
                onChange={(e) => set_ticket_desc_concern(e.target.value)}
                value={ticket_desc_concern}
                rows={6}
                spellCheck="false"
              ></textarea>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center py-2">
            <div className="w-full flex items-center justify-start py-2 px-1">
              <p className="text-xs font-normal">Add Videos</p>
            </div>
            <div className="w-full flex flex-row gap-4 items-center justify-center">
              <div className="flex items-center justify-center p-3 bg-[#ffffff] rounded-md shadow-xl">
                <label
                  className="text-md font-normal truncate cursor-pointer"
                  htmlFor="videoInput"
                >
                  <RiFileVideoLine />
                </label>
                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  multiple // Allow multiple file selection
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </div>
              <div className="w-full flex flex-col px-4 py-3 bg-[#f6edff] rounded-md border border-gray-300 max-h-[50px] overflow-auto scrollbar-hide">
                {video.length === 0 ? (
                  <p className="text-xs font-semibold text-gray-500">
                    No Videos Selected
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {video.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#FAF5FF] p-1 rounded-md shadow-lg"
                      >
                        <span className="text-xs font-normal mr-2">
                          {video.name}
                        </span>
                        <button
                          className="text-xs text-black bg-transparent border-none cursor-pointer"
                          onClick={() => removeVideo(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center py-2">
            <div className="w-full flex items-center justify-start py-2 px-1">
              <p className="text-xs font-normal">Add Images</p>
            </div>
            <div className="w-full flex flex-row gap-4 items-center justify-center">
              <div className="flex items-center justify-center p-3 bg-[#ffffff] rounded-md shadow-xl">
                <label
                  className="text-md font-normal truncate cursor-pointer"
                  htmlFor="fileInput"
                >
                  <MdOutlineBrokenImage />
                </label>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="w-full flex flex-col px-4 py-3 bg-[#f6edff] rounded-md border border-gray-300 max-h-[50px] overflow-auto scrollbar-hide">
                {file.length === 0 ? (
                  <p className="text-xs font-semibold text-gray-500 truncate">
                    No Images Selected
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {file.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#FAF5FF] p-1 rounded-md shadow-lg"
                      >
                        <span className="text-xs font-normal mr-2">
                          {file.name}
                        </span>
                        <button
                          className="text-xs text-black bg-transparent border-none cursor-pointer"
                          onClick={() => removeFile(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center justify-center py-2">
            <div className="w-full flex items-center justify-start py-2 px-1">
              <p className="text-xs font-normal truncate">Add Documents</p>
            </div>
            <div className="w-full flex flex-row gap-4 items-center justify-center">
              <div className="flex items-center justify-center p-3 bg-[#ffffff] rounded-md shadow-xl">
                <label
                  className="text-md font-normal truncate cursor-pointer"
                  htmlFor="documentInput"
                >
                  <GrDocumentText />
                </label>
                <input
                  id="documentInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={handleDocumentsChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="w-full flex flex-col px-4 py-3 bg-[#f6edff] rounded-md border border-gray-300 max-h-[50px] overflow-auto scrollbar-hide">
                {_document.length === 0 ? (
                  <p className="text-xs font-semibold text-gray-500 truncate">
                    No Documents Selected
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {_document.map((document, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#FAF5FF] p-1 rounded-md shadow-lg"
                      >
                        <span className="text-xs font-normal mr-2">
                          {document.name}
                        </span>
                        <button
                          className="text-xs text-black bg-transparent border-none cursor-pointer"
                          onClick={() => removeDocument(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row items-center justify-between py-4">
            <div className="w-1/2 flex items-center justify-start">
              <>
                {incompleteInput && (
                  <p className="text-xs font-semibold text-red-700 animate-shake">
                    Fill the Required Fields!
                  </p>
                )}
              </>
            </div>
            <div className="w-1/2 flex flex-row gap-2 items-center justify-end">
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
                  onClose();
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
    </div>
  );
};

export default UserModal;
