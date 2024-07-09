import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios";
import img from "../assets/logo.png";
import { LuUser, LuKey } from "react-icons/lu";
import { TbMailCode } from "react-icons/tb";
import useRole from "../Components/customHooks/useRole";
import Pin from "../Components/Popups/Pin";

const Login = () => {
  const [email, setEmail] = useState(""); // State variable for email input
  const [password, setPassword] = useState(""); // State variable for password input
  const navigate = useNavigate(); // Navigate to different routes
  const [loading, setLoading] = useState(false); // State variable for loading state
  const [invalid, setInvalid] = useState(true); // State variable for invalid credentials
  const [sendError, setSendError] = useState(false); // State variable for error in sending OTP
  const [otpError, setOtpError] = useState(false); // State variable for error in OTP verification
  const [ready, setReady] = useState(false); // State variable for OTP verification
  const [toggleSubmit, setToggleSubmit] = useState(false); // State variable for toggling submit button
  const [one_time_pin, setOneTimePin] = useState(0); // State variable for one-time pin
  const { role, setRole } = useRole(); // Custom hook for role
  const [isLogged, setIsLogged] = useState(false); // State variable for logged in state
  const [showModal, setShowModal] = useState(false); // State variable for showing modal
  const [hasClicked, setHasClicked] = useState(false); // State variable for click state
  const [canResend, setCanResend] = useState(true); // State variable for resending OTP
  const [countdown, setCountdown] = useState(0); // State variable for countdown
  const [startTime, setStartTime] = useState(false); // State variable for start time

  useEffect(() => {
    // Fetch CSRF token
    axiosClient.get("/csrf-cookie");
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isLogged) {
      LoginWithPassWord();
    } else {
      verifyOTP();
    }
  };

  const LoginWithPassWord = async () => {
    try {
      // Send login request
      const response = await axiosClient.post("/login", { email, password });
      if (response) {
        setShowModal(true);
        setHasClicked(true);
        setCanResend(false);
        setLoading(false);
        setIsLogged(true);
        setInvalid(false);
        setCountdown(60); // Start countdown from 60 seconds
      }
    } catch (err) {
      setSendError(true);
      setLoading(false);
      setTimeout(() => {
        setSendError(false);
      }, 3000);
    }
  };

  const verifyOTP = async () => {
    try {
      // Send OTP verification request
      const res = await axiosClient.post("/verify-otp", {
        email: email,
        otp: password, // Assuming you're reusing the password field for OTP
      });
      const data = res.data.user;
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      setRole(data.role);
      setInvalid(false);
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (error) {
      console.error(error);
      setInvalid(true);
      setOtpError(true);
      setTimeout(() => {
        setOtpError(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // console.log(one_time_pin);
  }, [one_time_pin]);

  useEffect(() => {
    // handle countdown
    let interval = null;
    if (!canResend && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((currentCountdown) => currentCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [canResend, countdown]);

  // Handle resend button click
  const handleSendClick = (e) => {
    e.preventDefault();
    if (!canResend) return;
    sendOTP();
  };

  // Render login form
  return (
    <>
      <div className="w-full min-h-[100svh] bg-da bg-cover bg-center flex items-center justify-center font-dm">
        <div className="min-h-[100svh] w-full bg-gradient-to-b lg:bg-gradient-to-r from-black/0 via-black/60 to-black/90 flex items-center justify-center">
          <div className="w-full lg:w-3/4 flex items-center justify-center lg:justify-end">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center justify-center p-10 bg-[#FAF5FF] rounded-xl min-w-[350px] md:min-w-[400px]">
                <div className="w-full flex items-center justify-center pb-6">
                  <img src={img} alt="" className="w-[60px]" />
                </div>
                <div className="w-full flex flex-col items-center justify-center pb-8">
                  <p className="font-bold text-[#113e21] text-sm uppercase">
                    Ticketing Management System
                  </p>
                  <p className="text-xs">login to your account</p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-6 py-2">
                  {/* Email and Password input fields */}
                  {isLogged !== true ? (
                    <>
                      <div className="w-full flex flex-col gap-2">
                        <p className="text-xs font-semibold px-1">Email</p>
                        <div className="py-3 px-4 bg-[#f6edff] rounded-md flex flex-row w-full gap-3 items-center justify-center">
                          <LuUser className="text-md" />
                          <input
                            type="text"
                            placeholder="enter email"
                            className="text-xs w-full outline-none bg-[#f6edff] truncate"
                            role="presentation"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            id="email-input"
                          />
                        </div>
                      </div>

                      <div className="w-full flex flex-col gap-2">
                        <p className="text-xs font-semibold px-1">Password</p>
                        <div className="py-3 px-4 bg-[#f6edff] rounded-md flex flex-row w-full gap-3 items-center justify-center">
                          <LuKey className="text-md" />
                          <input
                            // Password field
                            type="password"
                            placeholder="enter password"
                            className="text-xs w-full outline-none bg-[#f6edff] truncate"
                            role="presentation"
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password-input"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full flex flex-col gap-2">
                        <p className="text-xs font-semibold px-1">
                          One-time Password
                        </p>
                        <div className="py-3 px-4 bg-[#f6edff] rounded-md flex flex-row w-full gap-3 items-center justify-center">
                          <TbMailCode className="text-lg" />
                          <input
                            // OTP field
                            type="number"
                            placeholder="enter one time password"
                            className="text-xs w-full outline-none bg-[#f6edff] truncate"
                            role="presentation"
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password-input"
                          />
                        </div>
                      </div>
                      <div
                        // Resend button
                        className={`w-full flex items-center justify-center bg-[#2f2f2f] py-3 rounded-md cursor-pointer hover:bg-[#474747] transition-colors duration-700 ${
                          !canResend ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleSendClick}
                      >
                        <p className="text-xs font-semibold text-white">
                          {hasClicked ? "Resend" : "Send"}
                        </p>
                      </div>
                      {/* Countdown timer */}
                      {!canResend && (
                        <p className="text-xs font-semibold text-center mt-2">
                          Please wait {countdown} seconds
                        </p>
                      )}
                    </>
                  )}
                  {/*Error Message and Condition*/}
                  <div className="w-full flex flex-row items-center justify-between px-2">
                    <div>
                      <p
                        className={
                          sendError || otpError
                            ? "text-xs font-semibold text-red-700 animate-shake"
                            : "hidden"
                        }
                      >
                        {sendError
                          ? "Please Check Your Credentials!"
                          : "Invalid OTP!"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex items-end justify-start pt-4">
                    <button className="text-xs font-semibold text-white bg-[#2f2f2f] px-6 py-2 rounded-md hover:bg-[#5e5e5e] ease-in-out duration-700">
                      {loading ? (
                        // Loading spinner
                        <div className="flex flex-row py-1 gap-1">
                          <div
                            className="w-[7px] h-[8px] rounded-full bg-white animate-pulse"
                            style={{ animationDelay: `${0}ms` }}
                          ></div>
                          <div
                            className="w-[7px] h-[8px] rounded-full bg-white animate-pulse"
                            style={{ animationDelay: `${200}ms` }}
                          ></div>
                          <div
                            className="w-[7px] h-[8px] rounded-full bg-white animate-pulse"
                            style={{ animationDelay: `${400}ms` }}
                          ></div>
                        </div>
                      ) : (
                        <p className="text-xs">Login</p>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal */}
      {showModal === true && (
        <Pin isVisible={showModal} onClose={setShowModal} />
      )}
    </>
  );
};

export default Login;
