import React, { useEffect, useState, useRef } from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Loading from "./Loading/Loading";

const ImageModal = ({ onClose, images, fileIndex }) => {
  const modalRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(fileIndex);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay for better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2500 milliseconds = 2.5 seconds

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, []);

  // Ensure initial fileIndex points to a valid image
  useEffect(() => {
    if (!/\.(jpg|jpeg|png|gif)$/i.test(images[fileIndex])) {
      const firstImageIndex = images.findIndex(image =>
        /\.(jpg|jpeg|png|gif)$/i.test(image)
      );
      if (firstImageIndex !== -1) {
        setCurrentImageIndex(firstImageIndex);
      }
    }
  }, [fileIndex, images]);

  // Handle next image button click
  const handleNext = () => {
    let newIndex = currentImageIndex + 1;
    if (newIndex >= images.length) {
      newIndex = 0; // Loop back to the first file
    }

    // Find the next valid image file
    while (
      newIndex < images.length &&
      !/\.(jpg|jpeg|png|gif)$/i.test(images[newIndex])
    ) {
      newIndex++;
      if (newIndex >= images.length) {
        newIndex = 0; // Loop back to the first file
      }
    }

    setCurrentImageIndex(newIndex);
  };

  // Handle previous image button click
  const handlePrevious = () => {
    let newIndex = currentImageIndex - 1;
    if (newIndex < 0) {
      newIndex = images.length - 1; // Loop back to the last file
    }

    // Find the previous valid image file
    while (
      newIndex >= 0 &&
      !/\.(jpg|jpeg|png|gif)$/i.test(images[newIndex])
    ) {
      newIndex--;
      if (newIndex < 0) {
        newIndex = images.length - 1; // Loop back to the last file
      }
    }

    setCurrentImageIndex(newIndex);
  };

  // Handle keyboard navigation for next and previous images
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 39) {
        handleNext();
      } else if (event.keyCode === 37) {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, handlePrevious]);

  // Close modal when clicking outside the modal content
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if current image is an image file
  const currentImage = images[currentImageIndex];
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(currentImage);
  
  return (
    <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-25 text-black flex items-center justify-center">
      <div
        ref={modalRef}
        className="flex py-20 px-4 justify-center items-center"
      >
        <div
          id="container"
          className="relative flex items-center justify-center rounded-lg w-screen h-screen"
          onClick={(e) => {
            if (e.target.id === "container") onClose();
          }}
        >
          {/* Content based on file type */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loading />
            </div>
          ) : (
            <>
              {isImage && (
                <img
                  src={`http://localhost:8000/storage/${currentImage}`}
                  className="bg-cover p-4 w-auto h-auto rounded-lg"
                  alt="Full Image"
                />
              )}
            </>
          )}
          {/* Close button */}
          <button
            className="absolute text-white top-7 text-5xl right-5 m-2 px-2 font-bold z-1"
            onClick={onClose}
          >
            ×
          </button>
          {/* Previous button */}
          <button
            type="button"
            onClick={handlePrevious}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl text-white rounded-full"
          >
            <GrFormPrevious className="text-4xl" />
          </button>
          {/* Next button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-white rounded-full"
          >
            <GrFormNext className="text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
