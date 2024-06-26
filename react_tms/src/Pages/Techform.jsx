import React from 'react';
import Navigationtwo from '../Components/Navigationtwo';
import da from '../assets/da.jpg';
import { MdNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";

const handleNext = () => {
  setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
};

const handlePrevious = () => {
  setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
};

function Techform() {
    return (
        <>
            <Navigationtwo />

            <div className='w-full h-screen flex flex-col justify-center items-center bg-green-950'>

                <div className='bg-gradient-to-r from-green-950 via-green-800 to-green-800 h-screen w-full flex flex-row'>

                    {/* Red modal section */}
                    <div className='hidden md:flex flex-col py-24 px-16 w-3/4 gap-10 h-screen'>
                       
                        <h1 className='text-white  font-bold text-4xl text-center'>ATTACHMENTS</h1>

                        <img src={da}></img>

                            <div className="flex justify-center items-center mt-4">
                        <button
                          className="bg-white text-black px-4 py-2 mx-1 rounded-lg"
                          // onClick={handlePrevious}
                        >
                          <MdOutlineNavigateBefore />
                        </button>
                        <button
                          className="bg-white text-black px-4 py-2 mx-1 rounded-lg"
                          // onClick={handleNext}
                        >
                          <MdNavigateNext />
                        </button>
                      </div>
                        


                       

                        
                    </div>

                    {/* Second half of the screen */}
                    <form className=' flex flex-col w-full h-screen py-8 pt-20 lg:px-32 px-14 sm:items-center sm:align-center'>

                        <h1 className='text-white  font-bold text-4xl sm:text-center mb-4 text-center'>TECHNICAL FORM</h1>

                        <div
                            id="req-type"
                            className="text-center text-sm font-semibold font-montserrat border border-solid rounded-md border-black w-full px-4 sm:px-8 py-2 mb-2 bg-white"
                        >
                            {/* {ticket_type} */}
                            TICKET TYPE
                        </div>
                        <div className="p-2 border border-solid border-black resize-none font-montserrat rounded-md mb-2  h-full w-full bg-white">
                            {/* {request_desc} */}
                            DESCRIPTION
                        </div>

                        <textarea
                placeholder="FINDINGS"
                className="p-2 border border-solid border-black resize-none font-montserrat rounded-md mb-2 ] h-full w-full"
                // value={findings}
                // onChange={(e) => setFindings(e.target.value)}
              />
              <textarea
                placeholder="ACTIONS/REMARKS"
                className="p-2 border border-solid border-black resize-none font-montserrat rounded-md mb-2  h-full w-full"
                // value={actions}
                // onChange={(e) => setActions(e.target.value)}
              />
              <textarea
                placeholder="FOR REPLACEMENT"
                className="p-2 border border-solid border-black resize-none font-montserrat rounded-md mb-2 h-full w-full"
                // value={replacement}
                // onChange={(e) => setReplacement(e.target.value)}
              />
               <button
                type="button"
                className="bg-black w-full text-white font-bold py-2 rounded-lg md:hidden"
                // onClick={imgmodal}
              >
                ATTACHMENTS
              </button>


            <div className="flex justify-end w-full items-end gap-4 mt-2">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-lg text-sm font-semibold text-black bg-white uppercase"
                >
                  SUBMIT
                </button>
                <button
                  type="button"
                  className="py-3 px-6 rounded-lg text-sm font-semibold text-white bg-black uppercase"
                  onClick={() => onClose()}
                >
                  cancel
                </button>
              </div>

              



                        
                    </form>

                </div>

            </div>
        </>
    );
}

export default Techform;