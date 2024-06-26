import React, { useState, useEffect } from "react";
import { MdOutlinePersonOutline, MdOutlineLock } from "react-icons/md";
import imgUrl from "../assets/main.png"; // Importing image asset
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios";
import img from "../assets/logo.png";
import { div } from "prelude-ls";
import { RiMailSendLine } from "react-icons/ri";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { RiKey2Line } from "react-icons/ri";
import Loading from "../Components/Loading/Loading";

const Login = () => {
  const [email, setEmail] = useState(""); // State variable for email input
  const [password, setPassword] = useState(""); // State variable for password input
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(true); // State variable for invalid credentials
  const [sendError, setSendError] = useState(false);
  const [ready, setReady] = useState(false);
  const [toggleSubmit, setToggleSubmit] = useState(false);
  const [one_time_pin, setOneTimePin] = useState(0);
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setInvalid(false);
    axiosClient("/csrf-cookie");
    axiosClient
      .post("/verify-otp", {
        email: email,
        otp: one_time_pin,
      })
      .then((response) => {
        return response.data.user;
      })
      .then((res) => {
        setTimeout(() => {
          localStorage.setItem("username", res.username);
          setLoading(false);
          setInvalid(false);
          navigate("/dashboard"); // Redirect to dashboard on successful login
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        setTimeout(() => {
          setInvalid(true);
          setLoading(false);
        }, 2000);
      });
  };

  async function sendOTP() {
    const emailAdd = document.getElementById("email-input").value;

    const da = "@da.gov.ph";
    const gmail = "@gmail.com";
    if (emailAdd.includes(gmail)) {
      setInvalid(false);
      console.log("valid");
      setSendError(false);

      setToggleSubmit(!toggleSubmit);
      setInterval(() => {
        setToggleSubmit(false);
      }, 5000);

      document.getElementById("send-button").innerHTML = "Resend";
      setReady(true);
      axiosClient("/csrf-cookie");
      await axiosClient.post("/loginOTP", { email });
    } else {
      setInvalid(true);
      setSendError(true);
      console.log("invalid");
    }
  }
  useEffect(() => {
    console.log(one_time_pin);
  }, [one_time_pin]);

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
                    TMS.
                  </p>
                  <p className="text-xs">login to your account</p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-6 py-2">
                  <div className="w-full flex flex-col gap-2">
                    <p className="text-xs font-semibold px-1">Email</p>
                    <div className="py-3 px-4 bg-[#f6edff] rounded-md flex flex-row w-full gap-3 items-center justify-center">
                      <RiAccountPinCircleLine className="text-xl" />
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
                    <p className="text-xs font-semibold px-1">OTP</p>
                    <div className="flex flex-row justify-center items-center">
                      <div className="py-3 px-4 bg-[#f6edff] rounded-l-md flex flex-row w-full gap-3 items-center justify-center">
                        <RiMailSendLine className="text-xl" />
                        <input
                          type="number"
                          placeholder="one time pin"
                          className="text-xs w-full outline-none bg-[#f6edff] truncate"
                          autoComplete="off"
                          onChange={(e) => setOneTimePin(e.target.value)}
                          disabled={invalid === true ? true : false}
                        />
                      </div>
                      <div
                        className={`px-4 py-3 ease-in-out duration-500 rounded-r-md flex items-center justify-center  ${
                          toggleSubmit === false
                            ? "bg-[#2f2f2f] hover:bg-[#474747] cursor-pointer"
                            : "bg-[#2f2f2f] cursor-default"
                        }`}
                        onClick={sendOTP}
                        disabled={toggleSubmit ? false : true}
                      >
                        <p
                          className="text-xs font-normal text-white"
                          id="send-button"
                        >
                          Send
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-row items-center justify-between px-2">
                    <div>
                      <p
                        className={
                          sendError === true
                            ? "text-xs text-red-800 font-bold animate-shake"
                            : "hidden"
                        }
                      >
                        Invalid Credentials!
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-black font-bold cursor-pointer">
                        Forgot Password
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex items-end justify-start pt-4">
                    <button
                      className="text-xs font-semibold text-white bg-[#2f2f2f] px-6 py-2 rounded-md hover:bg-[#5e5e5e] ease-in-out duration-700"
                      disabled={ready === true ? false : true}
                    >
                      {loading ? (
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
    </>
  );
};

export default Login;
