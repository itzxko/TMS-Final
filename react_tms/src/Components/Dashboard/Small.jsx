import React from "react";
import { useState, useEffect, useRef } from "react";

// importing json for tickets
import ticketType from "../../JSON/Tickets.json";

// importing icons
import { BiTimer } from "react-icons/bi";
import { TbCalendarTime } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { FaCodeMerge } from "react-icons/fa6";
import { LuSettings2 } from "react-icons/lu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LiaExclamationSolid } from "react-icons/lia";
import { FiLayers } from "react-icons/fi";
import { BsSend } from "react-icons/bs";
import { BsEnvelopePaper } from "react-icons/bs";
import { TbProgressBolt } from "react-icons/tb";
import { MdOutlineWorkOutline } from "react-icons/md";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { LiaUser } from "react-icons/lia";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { MdOutlineNewLabel } from "react-icons/md";

// importing popup modals
import UserModal from "../UserModal";
import TechModal from "../TechModal";
import axiosClient from "../../axios";
import AdminModal from "../AdminModal";
import AcceptDenyModal from "../AcceptDenyModal";
import Navbar from "../Navbar";
import FollowUp from "../Popups/FollowUp";
import useRole from "../customHooks/useRole";

const Small = () => {
  const containerRef = useRef(null);
  const [ticketID, setTicketID] = useState(false); // use state for toggling filter
  const [filter, setFilter] = useState(false); // use state for toggling type filter
  const [openType, setOpenType] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTechForm, setShowTechForm] = useState(false);
  const [showAdminForm, setAdminForm] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showAcceptDenyModal, setShowAcceptDenyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setID] = useState(""); // use state for toggling role filter
  const [openRole, setOpenRole] = useState(false);
  const [pendingTicket, setPendingTicket] = useState([]);
  const [request_type, set_request_type] = useState("");
  const [request_desc, set_request_desc] = useState("");
  const [name_requester, set_name_requester] = useState(null);
  const [tech_name, set_tech_name] = useState([]);
  const [ticket_desc_findings, set_ticket_desc_findings] = useState("");
  const [ticket_desc_remarks, set_tickec_desc_remarks] = useState("");
  const [ticket_desc_replacement, set_ticket_desc_replacement] = useState("");
  const [ticket_status, set_ticket_status] = useState("");
  const [ticket_cde, set_ticket_cde] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState(null);
  const [bumpCode, setBumpCode] = useState("");
  const [ticket_assigned_to_name, setTicket_assigned_to_name] = useState(null);
  const [current_page, set_current_page] = useState(1);
  const [pages, setPages] = useState(null);

  const { role } = useRole();

  const handleScrollRight = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  };

  const handleScrollLeft = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= scrollOffset;
    }
  };

  // Generate Page Numbers
  const generatePageNumbers = (current_page, total_pages) => {
    const pages = [];
    if (current_page > 1) {
      pages.push(current_page - 1); // Previous page
    }
    pages.push(current_page); // Current page
    if (current_page < total_pages) {
      pages.push(current_page + 1); // Next page
    }
    return pages;
  };

  const pageNumbers = generatePageNumbers(current_page, pages);

  const nextPage = () => {
    if (current_page === pages) {
      return;
    }
    set_current_page(current_page + 1);
  };
  const prevPage = () => {
    if (current_page === 1) {
      return;
    }
    set_current_page(current_page - 1);
  };

  // Fetch pending ticket data
  useEffect(() => {
    let url = ``;
    switch (role) {
      case "user":
        url = "user/";
        break;
      case "technical":
        url = "tech/";
        break;
      case "admin":
        url = ``;
        break;
    }
    axiosClient
      .get(`/${url}pending-ticket?page=${current_page}`)
      .then((res) => {
        setPendingTicket(res.data.Message.data);
        set_current_page(res.data.Message.current_page);
        setPages(res.data.Message.last_page);
      });
  }, [current_page]);

  useEffect(() => {
    if (search === "" && role !== "technical" && role !== "user") {
      axiosClient
        .get(`/pending-ticket/All`)
        .then((res) => {
          return res.data;
        })
        .then((res) => {
          return res.data.Message;
        })
        .then((res) => {
          setPendingTicket(res.data);
          set_current_page(res.current_page);
          setPages(res.last_page);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [search]);

  const get_ticket_desc = (ticket_type_param) => {
    axiosClient
      .get("spec_ticket_type/" + ticket_type_param)
      .then((res) => {
        set_tech_name(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Check if there are tickets of the selected type
  const hasTicketsOfType = pendingTicket.length > 0;

  // Function to handle filter use state
  const handleFilter = () => {
    setFilter(!filter);
    setOpenType(false);
    setOpenRole(false);
    setOpenSearch(false);
  };

  // Function to toggle the type filter
  const handleOpenType = () => {
    setOpenType(!openType);
    setOpenRole(false);
  };

  // Toggle selected ticket type filter
  const handleType = (type, id) => {
    selectedType === type ? setSelectedType("All") : setSelectedType(type);
    setOpenType(false);
  };

  // Fetch initial data on component mount
  useEffect(() => {
    if (role === "user") {
      axiosClient
        .get("/ticket")
        .then((res) => {
          setData(res.data.Message);
          setLoading(true);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // Filtering Pending Ticket
  // useEffect(() => {
  //   let url = ``;
  //   if (role === "admin") {
  //     url = `/pending-ticket`;
  //   } else if (role === "technical") {
  //     url = "/tech/pending-ticket";
  //   } else if (role === "user") {
  //     url = "/user/pending-ticket";
  //   }
  //   axiosClient
  //     .get(url)
  //     .then((res) => {
  //       return res.data;
  //     })
  //     .then((res) => {
  //       setPendingTicket(res.Message.data);
  //       set_current_page(res.Message.current_page);
  //       setPages(res.Message.last_page);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    if (role === "admin" || role === "technical") {
      return;
    }
    const filterType = async () => {
      try {
        const res = await axiosClient.get(`/pending-ticket/${selectedType}`);
        const data1 = res.data;
        const data2 = data1.data;
        setPendingTicket(data2.Message.data);
        set_current_page(data2.Message.current_page);
        setPages(data2.Message.last_page);
      } catch (err) {
        console.log(err);
      }
    };
    filterType();
  }, [selectedType]);

  const filteredSearch = (e) => {
    e.preventDefault();
    axiosClient
      .get(`/pending-ticket/search/${search}`)
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        return res.data.Message;
      })
      .then((res) => {
        setPendingTicket(res.data);
        set_current_page(res.current_page);
        setPages(res.last_page);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Render Page
  return (
    <>
      <Navbar selectedRole={role} setShowUserForm={setShowUserForm} />
      {/* gray background page for the body */}
      <div className="block lg:hidden bg-[#ebebeb] min-h-[100vh] w-full px-6 md:px-8 lg:px-12 pb-6 font-dm">
        {/* for large screen and beyond */}
        <div className="block lg:hidden py-10"></div>
        <div className="flex flex-col w-full lg:hidden">
          <div className="w-full relative flex items-center ">
            <div className="w-full flex items-center overflow-hidden">
              <div
                className="w-full flex flex-row gap-4 py-4 overflow-x-auto scrollbar-hide"
                ref={containerRef}
              >
                <div className="relative bg-[#FAF5FF] min-w-[200px] flex flex-col items-center justify-center rounded-lg p-6">
                  <div className="w-full py-2"></div>
                  <div className="w-full flex items-end justify-between">
                    <p className="text-xs font-bold">Requested</p>
                    <p className="text-2xl font-extrabold text-[#a10b00]">16</p>
                  </div>
                  <div className="bg-gradient-to-tr from-[#a10b00] via-[#d62417] to-[#ff5044] p-2 rounded-lg shadow-xl absolute top-[-10px] left-6">
                    <MdOutlineNewLabel className="text-3xl text-white" />
                  </div>
                </div>
                <div className="relative bg-[#FAF5FF] min-w-[200px] flex flex-col items-center justify-center rounded-lg p-6">
                  <div className="w-full py-2"></div>
                  <div className="w-full flex items-end justify-between">
                    <p className="text-xs font-bold">Assigned</p>
                    <p className="text-2xl font-extrabold text-[#c95b00]">16</p>
                  </div>
                  <div className="bg-gradient-to-tr from-[#c95b00] via-[#e97619] to-[#ff7e15] p-2 rounded-lg shadow-xl absolute top-[-10px] left-6">
                    <LiaUser className="text-3xl text-white" />
                  </div>
                </div>
                <div className="relative bg-[#FAF5FF] min-w-[200px] flex flex-col items-center justify-center rounded-lg p-6">
                  <div className="w-full py-2"></div>
                  <div className="w-full flex items-end justify-between">
                    <p className="text-xs font-bold">Ongoing</p>
                    <p className="text-2xl font-extrabold text-[#570075]">16</p>
                  </div>
                  <div className="bg-gradient-to-tr from-[#570075] via-[#b61ce9] to-[#c517ff] p-2 rounded-lg shadow-xl absolute top-[-10px] left-6">
                    <MdOutlineWorkOutline className="text-3xl text-white" />
                  </div>
                </div>
                <div className="relative bg-[#FAF5FF] min-w-[200px] flex flex-col items-center justify-center rounded-lg p-6">
                  <div className="w-full py-2"></div>
                  <div className="w-full flex items-end justify-between">
                    <p className="text-xs font-bold">For Checking</p>
                    <p className="text-2xl font-extrabold text-[#007a3f]">16</p>
                  </div>
                  <div className="bg-gradient-to-tr from-[#007a3f] via-[#13c26d] to-[#25d882] p-2 rounded-lg shadow-xl absolute top-[-10px] left-6">
                    <TbProgressBolt className="text-3xl text-white" />
                  </div>
                </div>
                <div className="relative bg-[#FAF5FF] min-w-[200px] flex flex-col items-center justify-center rounded-lg p-6">
                  <div className="w-full py-2"></div>
                  <div className="w-full flex items-end justify-between">
                    <p className="text-xs font-bold">Done</p>
                    <p className="text-2xl font-extrabold text-[#363636]">16</p>
                  </div>
                  <div className="bg-gradient-to-tr from-[#363636] via-[#6d6a6a] to-[#727272] p-2 rounded-lg shadow-xl absolute top-[-10px] left-6">
                    <TbProgressBolt className="text-3xl text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute left-[-12px]"
              onClick={() => handleScrollLeft(160)}
            >
              <MdOutlineKeyboardArrowLeft className="text-xl" />
            </div>
            <div className="absolute right-[-12px]">
              <MdOutlineKeyboardArrowRight
                className="text-xl"
                onClick={() => handleScrollRight(160)}
              />
            </div>
          </div>
          <div className="">
            {/* div for welcome note and filter, add and role buttons */}
            <div className="flex flex-row gap-2 justify-between items-center py-2">
              <div className="flex">
                <p className="text-xs font-bold text-[#113e21] truncate">
                  Hi, {localStorage.getItem("username")}!
                </p>
              </div>

              <div className="flex flex-row justify-center items-center gap-2">
                <div className="flex items-center justify-center px-4 py-3 bg-[#FAF5FF] rounded-lg cursor-pointer ease-in-out duration-500 group">
                  <div
                    className="flex items-center justify-center group-hover:pr-2"
                    onClick={(e) => filteredSearch(e)}
                  >
                    <BiSearch className="text-sm group-hover:rotate-[360deg] transition-all duration-500" />
                  </div>
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Search tickets"
                    role="presentation"
                    spellCheck="false"
                    className="outline-none bg-[#FAF5FF] text-xs font-normal hidden group-hover:block pl-3 border-l border-gray-300"
                    onChange={(e) => setSearch(e.target.value.toLowerCase())}
                  />
                </div>
                <div className="relative flex flex-row justify-end">
                  <div
                    className={
                      !filter
                        ? "flex flex-row items-center justify-center gap-1 px-4 py-3 bg-[#FAF5FF] rounded-lg cursor-pointer ease-in-out duration-500"
                        : "flex flex-row items-center justify-center gap-1 px-4 py-3 bg-[#2f2f2f] rounded-lg cursor-pointer ease-in-out duration-500"
                    }
                    onClick={handleFilter}
                  >
                    {!filter ? (
                      <LuSettings2 className="text-sm ease-in-out duration-500 text-black" />
                    ) : (
                      <MdClose className="text-sm ease-in-out duration-500 text-white" />
                    )}
                  </div>
                  <div
                    className={
                      !filter
                        ? "hidden"
                        : "absolute bg-white flex flex-col justify-center items-center rounded-lg top-[50px] shadow-lg"
                    }
                  >
                    <div className="relative w-full flex flex-col justify-start items-end">
                      <div
                        className="flex flex-row-reverse gap-1 items-center justify-end bg-[#FAF5FF] hover:bg-gray-100 ease-in-out duration-700 w-full  h-full cursor-pointer px-4 py-2 rounded-lg"
                        onClick={handleOpenType}
                      >
                        <div className="text-center">
                          <p className="text-xs font-normal">Type</p>
                        </div>
                        <div className="flex items-center justify-center text-sm">
                          {openType ? <MdClose /> : <FiLayers />}
                        </div>
                      </div>
                      <div
                        className={
                          openType
                            ? "absolute bg-[#FAF5FF] rounded-lg flex flex-col justify-center right-[92px] items-center shadow-lg overflow-hidden"
                            : "hidden"
                        }
                      >
                        {ticketType.map((type, index) => (
                          <div
                            key={type.id}
                            className={
                              selectedType === type.type
                                ? "cursor-pointer bg-[#2f2f2f] text-white w-full py-2 px-4 max-w-[26vh]"
                                : "cursor-pointer bg-[#FAF5FF] text-black w-full py-2 px-4 max-w-[26vh]"
                            }
                            onClick={() => handleType(type.type, type.id)}
                          >
                            <p className="text-xs font-normal truncate block">
                              {type.type}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* div for ticket cards */}
            <div className="py-2 min-h-[50vh] w-full flex justify-center items-start">
              {pendingTicket.length === 0 ? (
                <div className=" flex items-center justify-center w-full h-[70vh]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <LiaExclamationSolid className="text-3xl animate-bounce" />
                    <p className="text-xs font-semibold truncate">
                      no available tickets for this type
                    </p>
                  </div>
                </div>
              ) : !hasTicketsOfType ? (
                <div className=" flex items-center justify-center w-full h-[70vh]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <LiaExclamationSolid className="text-3xl animate-bounce" />
                    <p className="text-xs font-semibold truncate">
                      no available tickets for this type
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-6 w-full">
                  {pendingTicket
                    // Filter tickets based on role
                    .filter((data) => {
                      if (role === "technical") {
                        return (
                          data.ticket_assigned_to_name ===
                          localStorage.getItem("username")
                        );
                      } else if (role === "user") {
                        return (
                          data.ticket_client_name ===
                          localStorage.getItem("username")
                        );
                      }
                      return true;
                    })
                    // Mapping the ticket card
                    .map((data, index) =>
                      data.ticket_type === selectedType ? (
                        // data mapping if there is a specific selected type and its conditions
                        <div
                          key={index}
                          className="bg-[#FAF5FF] min-h-[250px] rounded-lg overflow-hidden px-6 py-6"
                        >
                          <div className="h-full flex flex-col">
                            <div className="h-1/5 flex flex-rows-2 gap-4 ">
                              <div className="flex items-center justify-center rounded-md">
                                <div className="bg-[#f6edff] p-4 rounded-lg">
                                  <FaCodeMerge className="text-[#2f2f2f] text-xl" />
                                </div>
                              </div>
                              <div className="flex items-start justify-center">
                                <div className="grid grid-rows-3 text-start">
                                  <p className="text-xs font-bold truncate">
                                    {data.ticket_type}
                                  </p>
                                  {/* Display ticket status */}
                                  <p className="text-xs font-extrabold capitalize truncate">
                                    {data.ticket_status === "1" ? (
                                      <span className="text-[#a10b00]">
                                        Requested
                                      </span>
                                    ) : data.ticket_status === "2" ? (
                                      <span className="text-[#c95b00]">
                                        Assigned
                                      </span>
                                    ) : data.ticket_status === "3" ? (
                                      <span className="text-[#570075]">
                                        Ongoing
                                      </span>
                                    ) : data.ticket_status === "4" ? (
                                      <span className="text-[#007a3f]">
                                        For Checking
                                      </span>
                                    ) : (
                                      <span className="text-[#363636]">
                                        Done
                                      </span>
                                    )}
                                  </p>

                                  <p className="text-xs font-normal truncate">
                                    {data.ticket_assigned_to_name
                                      ? data.ticket_assigned_to_name
                                      : "No Data"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="h-2/5 w-full pt-6 pb-4 px-1">
                              <div className="w-full h-full">
                                <p className="line-clamp-3 text-xs font-normal">
                                  {data.ticket_desc_concern}
                                </p>
                              </div>
                            </div>
                            <div className="h-1/5 w-full flex items-center justify-center py-4">
                              <div className="w-full grid grid-cols-2 px-2 gap-4">
                                <div className="text-start">
                                  <div className="flex gap-2 items-center">
                                    <TbCalendarTime className="text-md text-[#2f2f2f]" />
                                    <p className="text-xs font-semibold text-gray-600 truncate">
                                      {data.ticket_status_if_date}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-start">
                                  <div className="flex gap-2 items-center">
                                    <BiTimer className="text-md text-[#2f2f2f]" />
                                    <p className="text-xs font-semibold text-gray-600 truncate">
                                      {data.ticket_update_date}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="h-1/45 flex justify-center items-center">
                              {/* button if role is user and its conditions */}
                              {role === "user" && data.ticket_status === "5" ? (
                                // when ticket status is 5 or done
                                <button className="bg-[#595959] w-full text-white py-3 rounded-md ease-in-out duration-500 disabled">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Details
                                  </p>
                                </button>
                              ) : role === "user" &&
                                data.ticket_status === "4" ? (
                                // when ticket status is 4 or for checking
                                <button className="bg-[#595959] w-full text-white py-3 rounded-md ease-in-out duration-500 disabled">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Review
                                  </p>
                                </button>
                              ) : role === "user" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowFollowUp(true);
                                      setBumpCode(data.ticket_cde);
                                    }}
                                  >
                                    Follow Up
                                  </p>
                                </button>
                              ) : // button if role is admin and its conditions
                              role === "admin" && data.ticket_status === "2" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setAdminForm(true);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      setTicket_assigned_to_name(
                                        data.ticket_assigned_to_name
                                      );
                                      get_ticket_desc(data.ticket_type);

                                      set_request_type(data.ticket_type);
                                      setID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                    }}
                                  >
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" &&
                                data.ticket_status === "1" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setAdminForm(true);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      setTicket_assigned_to_name(
                                        data.ticket_assigned_to_name
                                      );
                                      get_ticket_desc(data.ticket_type);

                                      set_request_type(data.ticket_type);
                                      setID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                    }}
                                  >
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Details
                                  </p>
                                </button>
                              ) : // button if role is technical and its conditions
                              role === "technical" &&
                                data.ticket_status === "5" ? (
                                // when ticket status is 5 or done
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Details
                                  </p>
                                </button>
                              ) : role === "technical" &&
                                data.ticket_status === "2" ? (
                                // when ticket status is 2 or assigned
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Review
                                  </p>
                                </button>
                              ) : role === "technical" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowTechForm(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                    }}
                                  >
                                    Update
                                  </p>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : // data mapping if selected type is all
                      selectedType === "All" ? (
                        <div
                          key={index}
                          className="bg-[#FAF5FF] min-h-[250px] rounded-lg overflow-hidden px-6 py-6"
                        >
                          <div className="h-full flex flex-col">
                            <div className="flex flex-rows-2 gap-4">
                              <div className="flex items-center justify-center rounded-md">
                                <div className="bg-[#f6edff] p-4 rounded-lg">
                                  <FaCodeMerge className="text-[#2f2f2f] text-xl" />
                                </div>
                              </div>
                              <div className="flex items-start justify-center py-1">
                                <div className="grid grid-rows-3 text-start">
                                  <p className="text-xs font-bold truncate">
                                    {data.ticket_type}
                                  </p>
                                  <p className="text-xs font-bold text-[#113e21] capitalize truncate">
                                    {data.ticket_status === "1" ? (
                                      <span className="text-[#a10b00]">
                                        Requested
                                      </span>
                                    ) : data.ticket_status === "2" ? (
                                      <span className="text-[#c95b00]">
                                        Assigned
                                      </span>
                                    ) : data.ticket_status === "3" ? (
                                      <span className="text-[#570075]">
                                        Ongoing
                                      </span>
                                    ) : data.ticket_status === "4" ? (
                                      <span className="text-[#007a3f]">
                                        For Checking
                                      </span>
                                    ) : (
                                      <span className="text-[#363636]">
                                        Done
                                      </span>
                                    )}
                                  </p>

                                  <p className="text-xs font-semibold capitalize text-gray-500 truncate">
                                    {data.ticket_assigned_to_name
                                      ? data.ticket_assigned_to_name
                                      : "No Data"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="w-full py-6 px-1">
                              <div className="w-full h-full">
                                <p className="line-clamp-3 text-xs font-normal">
                                  {data.ticket_desc_concern}
                                </p>
                              </div>
                            </div>
                            <div className="w-full flex items-center justify-center py-4">
                              <div className="w-full grid grid-cols-2 px-2 gap-4">
                                <div className="text-start">
                                  <div className="flex gap-2 items-center">
                                    <TbCalendarTime className="text-md text-[#2f2f2f]" />
                                    <p className="text-xs font-semibold text-gray-600 truncate">
                                      {data.ticket_status_if_date}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-start">
                                  <div className="flex gap-2 items-center">
                                    <BiTimer className="text-md text-[#2f2f2f]" />
                                    <p className="text-xs font-semibold text-gray-600 truncate">
                                      {data.ticket_update_date}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center items-center">
                              {/* button if role is user and its conditions */}
                              {role === "user" && data.ticket_status === "5" ? (
                                // when ticket status is 5 or done
                                <button className="bg-[#3d3d3d] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Details
                                  </p>
                                </button>
                              ) : role === "user" &&
                                data.ticket_status === "4" ? (
                                // when ticket status is 4 or for checking
                                <button className="bg-[#3d3d3d] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Review
                                  </p>
                                </button>
                              ) : role === "user" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowFollowUp(true);
                                      setBumpCode(data.ticket_cde);
                                    }}
                                  >
                                    Follow Up
                                  </p>
                                </button>
                              ) : // button if role is admin and its conditions
                              role === "admin" && data.ticket_status === "2" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setAdminForm(true);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      setTicket_assigned_to_name(
                                        data.ticket_assigned_to_name
                                      );
                                      get_ticket_desc(data.ticket_type);

                                      set_request_type(data.ticket_type);
                                      setID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                    }}
                                  >
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" &&
                                data.ticket_status === "1" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setAdminForm(true);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      setTicket_assigned_to_name(
                                        data.ticket_assigned_to_name
                                      );
                                      get_ticket_desc(data.ticket_type);

                                      set_request_type(data.ticket_type);
                                      setID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                    }}
                                  >
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Details
                                  </p>
                                </button>
                              ) : // button if role is technical and its conditions
                              role === "technical" &&
                                data.ticket_status === "5" ? (
                                // when ticket status is 5 or done
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Details
                                  </p>
                                </button>
                              ) : role === "technical" &&
                                data.ticket_status === "2" ? (
                                // when ticket status is 2 or assigned
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowAcceptDenyModal(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                      set_ticket_status(data.ticket_status);
                                    }}
                                  >
                                    Review
                                  </p>
                                </button>
                              ) : role === "technical" ? (
                                <button className="bg-[#2f2f2f] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setShowTechForm(true);
                                      setTicketID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      set_name_requester(
                                        data.ticket_client_name
                                      );
                                      set_tickec_desc_remarks(
                                        data.ticket_desc_remarks
                                      );
                                      set_ticket_desc_findings(
                                        data.ticket_desc_findings
                                      );
                                      set_ticket_desc_replacement(
                                        data.ticket_desc_replacement
                                      );
                                    }}
                                  >
                                    Update
                                  </p>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                </div>
              )}
            </div>
          </div>

          {current_page && (
            <div className="flex flex-row gap-1 items-center justify-center w-full p-12">
              <button
                className="text-black p-1 rounded-md ease-in-out duration-500 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  prevPage();
                }}
                disabled={current_page === 1}
              >
                <FaAngleLeft className="text-xs" />
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`p-1 ease-in-out duration-500  font-semibold ${
                    pageNumber === current_page
                      ? "text-sm text-black"
                      : "text-xs text-black/50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    set_current_page(pageNumber);
                  }}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="text-black p-1 rounded-md ease-in-out duration-500 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  nextPage();
                }}
                disabled={current_page === pages}
              >
                <FaAngleRight className="text-xs" />
              </button>
            </div>
          )}
        </div>
        <div className="fixed bottom-10 right-4 flex flex-col-reverse items-end gap-2"></div>
      </div>
      {/* Modals for adding, updating, or assigning tickets */}
      {showFollowUp && (
        <FollowUp
          isVisible={showFollowUp}
          data={data}
          ticket_cde={ticket_cde}
          bumpCode={bumpCode}
          onClose={() => setShowFollowUp(false)}
        />
      )}
      <UserModal
        data={data}
        isVisible={showUserForm}
        onClose={() => setShowUserForm(false)}
      />

      {/* <AdminModal
        isVisible={showAdminForm}
        ticket_type={request_type}
        request_desc={request_desc}
        data={tech_name}
        ticket_cde={ticket_cde}
        id={id}
        selected={setTicket_assigned_to_name}
        name_requester={name_requester}
        assigned_name={ticket_assigned_to_name}
        onClose={() => setAdminForm(false)}
      /> */}
      <AdminModal
        isVisible={showAdminForm}
        ticket_type={request_type}
        request_desc={request_desc}
        data={tech_name}
        ticket_cde={ticket_cde}
        id={id}
        selected={setTicket_assigned_to_name}
        name_requester={name_requester}
        assigned_name={ticket_assigned_to_name}
        onClose={() => setAdminForm(false)}
      />
      <TechModal
        isVisible={showTechForm}
        ticketID={ticketID}
        ticket_type={request_type}
        request_desc={request_desc}
        ticket_cde={ticket_cde}
        requester_name={name_requester}
        ticket_desc_remarks={ticket_desc_remarks}
        ticket_desc_findings={ticket_desc_findings}
        ticket_desc_replacement={ticket_desc_replacement}
        onClose={() => setShowTechForm(false)}
      />
      <AcceptDenyModal
        isVisible={showAcceptDenyModal}
        ticketID={ticketID}
        ticket_type={request_type}
        request_desc={request_desc}
        ticket_cde={ticket_cde}
        requester_name={name_requester}
        ticket_desc_remarks={ticket_desc_remarks}
        ticket_desc_findings={ticket_desc_findings}
        ticket_desc_replacement={ticket_desc_replacement}
        ticket_status={ticket_status}
        selectedRole={role}
        onClose={() => setShowAcceptDenyModal(false)}
      />
    </>
  );
};

export default Small;
