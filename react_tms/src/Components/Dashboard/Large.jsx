import React, { useState, useEffect, useRef } from "react";
import ticketType from "../../JSON/Tickets.json"; // importing json for tickets
import Navbar from "../Navbar"; //Navbar
import axiosClient from "../../axios"; //axios

// importing icons
import { LuSettings2 } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import { BiSearch } from "react-icons/bi";
import { FiLayers } from "react-icons/fi";
import { RiUserSharedLine } from "react-icons/ri";
import { TbTransfer } from "react-icons/tb";
import { RiEditLine } from "react-icons/ri";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LiaExclamationSolid } from "react-icons/lia";
import { RxInfoCircled } from "react-icons/rx";
import { FiCheckSquare } from "react-icons/fi";
import { BsSend } from "react-icons/bs";
import { BsEnvelopePaper } from "react-icons/bs";
import { TbProgressBolt } from "react-icons/tb";
import { MdOutlineWorkOutline } from "react-icons/md";
import { MdOutlineDownloadDone } from "react-icons/md";
import { LiaUser } from "react-icons/lia";
import { MdOutlineNewLabel } from "react-icons/md";

// importing popup modals
import UserModal from "../UserModal";
import TechModal from "../TechModal";
import AdminModal from "../AdminModal";
import AcceptDenyModal from "../AcceptDenyModal";
import FollowUp from "../Popups/FollowUp";
import useRole from "../customHooks/useRole";

const Large = () => {
  const [ticketID, setTicketID] = useState(false);
  const [name_requester, set_name_requester] = useState(null);
  const [filter, setFilter] = useState(false); // use state for toggling filter
  const [openType, setOpenType] = useState(false); // use state for toggling type filter
  const [selectedType, setSelectedType] = useState("All"); // use state for setting the selected type
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTechForm, setShowTechForm] = useState(false);
  const [showAdminForm, setAdminForm] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showAcceptDenyModal, setShowAcceptDenyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setID] = useState("");
  const [pages, setPages] = useState(null);
  const [search, setSearch] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user"); // use state for setting the selected role
  // const [role, setRole] = useState("");
  const [pendingTicket, setPendingTicket] = useState([]);
  const [request_type, set_request_type] = useState("");
  const [request_desc, set_request_desc] = useState("");
  const [tech_name, set_tech_name] = useState([]);
  const [ticket_cde, set_ticket_cde] = useState([]);
  const [ticket_desc_findings, set_ticket_desc_findings] = useState("");
  const [ticket_desc_remarks, set_tickec_desc_remarks] = useState("");
  const [ticket_desc_replacement, set_ticket_desc_replacement] = useState("");
  const [ticket_status, set_ticket_status] = useState("");
  const [requested, setRequested] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [forChecking, setForChecking] = useState(0);
  const [done, setDone] = useState(0);
  const [current_page, set_current_page] = useState(1);
  const [name, setName] = useState([]);
  const [bumpCode, setBumpCode] = useState("");
  const [ticket_assigned_to_name, setTicket_assigned_to_name] = useState(null);
  const containerRef = useRef(null); //scrolling
  const { role } = useRole();
  const [requestCount, setRequestCount] = useState(0);

  //handling scrolling
  const handleScrollDown = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollTop += scrollOffset;
    }
  };

  // Check if there are tickets of the selected type
  const hasTicketsOfType = pendingTicket.length > 0;
  // Function to handle filter use state
  const handleFilter = () => {
    setFilter(!filter);
    setOpenType(false);
  };

  // Function to toggle the type filter
  const handleOpenType = () => {
    setOpenType(!openType);
  };

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

  useEffect(() => {
    if (search === "" && role !== "technical") {
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

  //For Employee Job Count
  useEffect(() => {
    if (role === "admin") {
      axiosClient
        .get("/getEmployeeJobs")
        .then((res) => {
          setName(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const get_ticket_desc = (ticket_type_param) => {
    axiosClient
      .get("spec_ticket_type/" + ticket_type_param)
      .then((res) => {
        set_tech_name(res.data);
      })
      .catch((err) => console.log(err));
  };

  // Toggle selected ticket type filter
  const handleType = (type, id) => {
    setSelectedType(selectedType === type ? "All" : type);
    setOpenType(false);
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

  // Fetch initial data on component mount
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

  useEffect(() => {
    if (pendingTicket) {
      const requestedCount = pendingTicket.filter(
        (item) => item.ticket_status === "1"
      ).length;
      const assignedCount = pendingTicket.filter(
        (item) => item.ticket_status === "2"
      ).length;
      const ongoingCount = pendingTicket.filter(
        (item) => item.ticket_status === "3"
      ).length;
      const forCheckingCount = pendingTicket.filter(
        (item) => item.ticket_status === "4"
      ).length;
      const doneCount = pendingTicket.filter(
        (item) => item.ticket_status === "5"
      ).length;

      setRequested(requestedCount);
      setAssigned(assignedCount);
      setOngoing(ongoingCount);
      setForChecking(forCheckingCount);
      setDone(doneCount);
    }
  }, [pendingTicket]);

  //Render Page
  return (
    <>
      <Navbar selectedRole={role} setShowUserForm={setShowUserForm} />
      {/* gray background page for the body */}
      <div className="relative hidden lg:block bg-[#ebebeb] min-h-[100vh] w-full px-6 md:px-8 lg:px-10 pb-6 font-dm items-center justify-center">
        {/* for large screen and beyond */}
        <div className="hidden lg:block py-12"></div>
        <div
          className={
            role === "admin"
              ? "hidden lg:flex flex-row w-full gap-6"
              : "hidden lg:flex w-full gap-6"
          }
        >
          {/* div for table */}
          <div
            className={
              role === "admin" ? "flex flex-col w-4/5" : "flex flex-col w-full"
            }
          >
            <div
              className={
                role === "admin"
                  ? "w-full grid grid-cols-5 gap-6 py-6"
                  : "hidden"
              }
            >
              <div className="relative bg-[#FAF5FF] p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-500">
                <div className="w-full flex py-2"></div>
                <div className="w-full flex flex-row-reverse items-end justify-between">
                  <p className="text-2xl font-bold text-[#a10b00]">
                    {requested}
                  </p>
                  <p className="text-xs font-semibold">Requested</p>
                </div>
                <div className="absolute top-[-20px] left-6 p-3 rounded-lg shadow-xl bg-gradient-to-tr from-[#a10b00] via-[#d62417] to-[#ff5044]">
                  <MdOutlineNewLabel className="text-3xl text-white" />
                </div>
              </div>
              <div className="relative bg-[#FAF5FF] p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-500">
                <div className="w-full flex py-2"></div>
                <div className="w-full flex flex-row-reverse items-end justify-between">
                  <p className="text-2xl font-bold text-[#c95b00]">
                    {assigned}
                  </p>
                  <p className="text-xs font-semibold">Assigned</p>
                </div>
                <div className="absolute top-[-20px] left-6 p-3 rounded-lg shadow-xl bg-gradient-to-tr from-[#c95b00] via-[#e97619] to-[#ff7e15]">
                  <LiaUser className="text-3xl text-white" />
                </div>
              </div>
              <div className="relative bg-[#FAF5FF] p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-500">
                <div className="w-full flex py-2"></div>
                <div className="w-full flex flex-row-reverse items-end justify-between">
                  <p className="text-2xl font-bold text-[#570075]">{ongoing}</p>
                  <p className="text-xs font-semibold">Ongoing</p>
                </div>
                <div className="absolute top-[-20px] left-6 p-3 rounded-lg shadow-xl bg-gradient-to-tr from-[#570075] via-[#b61ce9] to-[#c517ff]">
                  <MdOutlineWorkOutline className="text-3xl text-white" />
                </div>
              </div>
              <div className="relative bg-[#FAF5FF] p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-500">
                <div className="w-full flex py-2"></div>
                <div className="w-full flex flex-row-reverse items-end justify-between">
                  <p className="text-2xl font-bold text-[#007a3f]">
                    {forChecking}
                  </p>
                  <p className="text-xs font-semibold">For Checking</p>
                </div>
                <div className="absolute top-[-20px] left-6 p-3 rounded-lg shadow-xl bg-gradient-to-tr from-[#007a3f] via-[#13c26d] to-[#25d882]">
                  <TbProgressBolt className="text-3xl text-white" />
                </div>
              </div>
              <div className="relative bg-[#FAF5FF] p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-500">
                <div className="w-full flex py-2"></div>
                <div className="w-full flex flex-row-reverse items-end justify-between">
                  <p className="text-2xl font-bold text-[#363636]">{done}</p>
                  <p className="text-xs font-semibold">Done</p>
                </div>
                <div className="absolute top-[-20px] left-6 p-3 rounded-lg shadow-xl bg-gradient-to-tr from-[#363636] via-[#6d6a6a] to-[#727272]">
                  <MdOutlineDownloadDone className="text-3xl text-white" />
                </div>
              </div>
            </div>

            {/* div for welcome note and filter, add and role buttons */}
            <div className="flex flex-row justify-between items-center">
              <p className="text-sm font-bold text-[#113e21]">
                Hi, {localStorage.getItem("username")}
              </p>
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
                <div className="relative flex flex-row justify-end items-start">
                  <div
                    className="flex flex-row items-center justify-center py-3 px-4  bg-[#FAF5FF] rounded-lg cursor-pointer ease-in-out duration-500"
                    onClick={handleFilter}
                  >
                    <div className="flex items-center justify-center">
                      {!filter ? (
                        <LuSettings2 className="text-sm text-black" />
                      ) : (
                        <MdClose className="text-sm text-black" />
                      )}
                    </div>
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
                        className="flex flex-row-reverse gap-2 items-center justify-end bg-[#FAF5FF] hover:bg-gray-100 ease-in-out duration-700 w-full h-full cursor-pointer px-4 py-3 rounded-lg"
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
                            ? "absolute bg-[#FAF5FF] rounded-lg flex flex-col justify-center items-center left-[-236px] shadow-lg overflow-hidden"
                            : "hidden"
                        }
                      >
                        {ticketType.map((type, index) => (
                          <div
                            key={type.id}
                            className={
                              selectedType === type.type
                                ? "cursor-pointer bg-[#2f2f2f] text-white w-full py-2 px-4"
                                : "cursor-pointer bg-[#FAF5FF] text-black w-full py-2 px-4"
                            }
                            onClick={() => handleType(type.type, type.id)}
                          >
                            <p className="text-xs font-normal truncate">
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
            {/* start of div for table */}
            <div className="flex pt-6">
              <div className="bg-[#FAF5FF] flex flex-col rounded-lg antialiased min-h-[70vh] w-full overflow-hidden">
                {/* div for dashboard header with black bg */}
                <div className="flex flex-row justify-between py-4 px-8 bg-[#2f2f2f]">
                  <div className="flex justify-center items-center">
                    <p className="text-white font-semibold text-sm">
                      Dashboard.
                    </p>
                  </div>
                </div>
                {/* div for table header*/}
                <div className="px-12 py-8 h-full">
                  <table className="w-full table-fixed">
                    <thead className="text-xs font-bold text-gray-500">
                      <tr className="border-b">
                        <th scope="col" className="text-start p-4 truncate">
                          Ticket Type
                        </th>
                        <th scope="col" className="text-start p-4 truncate">
                          Ticket Description
                        </th>
                        <th scope="col" className="text-start p-4 truncate">
                          Request Date
                        </th>
                        <th scope="col" className="text-start p-4 truncate">
                          Update Date
                        </th>
                        <th
                          className={
                            !(role === "admin" || role === "technical")
                              ? "hidden"
                              : "text-start p-4 truncate"
                          }
                        >
                          Requested By
                        </th>
                        <th
                          className={
                            !(role === "admin" || role === "user")
                              ? "hidden"
                              : "text-start p-4 truncate"
                          }
                        >
                          Assigned To
                        </th>
                        <th scope="col" className="text-start p-4 truncate">
                          Status
                        </th>
                        <th scope="col" className="text-center p-4 truncate">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {/* condition if there are no tickets for the selected type */}
                    {pendingTicket.length === 0 ? (
                      <tbody className="h-[40vh]">
                        <tr>
                          <td
                            colSpan="7"
                            className="h-full text-sm font-normal text-center"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <LiaExclamationSolid className="text-3xl animate-bounce" />
                              <p className="text-xs font-semibold truncate">
                                no available tickets for this type
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : !hasTicketsOfType ? (
                      <tbody className="h-[40vh]">
                        <tr>
                          <td
                            colSpan="7"
                            className="h-full text-sm font-normal text-center"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <LiaExclamationSolid className="text-3xl animate-bounce" />
                              <p className="text-xs font-semibold truncate">
                                no available tickets for this type
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      // condition if there are tickets for the selected type
                      pendingTicket
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
                        // mapping the data to the table
                        .map((data, index) =>
                          data.ticket_type === selectedType ? (
                            // data mapping if there is a specific selected type and its conditions
                            <tbody>
                              <tr
                                className="text-xs font-normal hover:bg-[#f6edff] ease-in-out duration-500 cursor-pointer border-b"
                                key={index.id}
                              >
                                <th
                                  scope="row"
                                  className="text-[#24693c] text-start p-4"
                                >
                                  <p className="w-full truncate">
                                    {data.ticket_type}
                                  </p>
                                </th>
                                <td className="p-4" scope="">
                                  <p className="w-full line-clamp-2">
                                    {data.ticket_desc_concern}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <p className="w-full truncate">
                                    {data.ticket_status_if_date}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <p className="w-full truncate">
                                    {data.ticket_update_date}
                                  </p>
                                </td>
                                <td
                                  className={
                                    !(role === "admin" || role === "technical")
                                      ? "hidden"
                                      : "p-4"
                                  }
                                >
                                  <p className="font-bold text-gray-600 w-full truncate">
                                    {data.ticket_client_name}
                                  </p>
                                </td>
                                <td
                                  className={
                                    !(role === "admin" || role === "user")
                                      ? "hidden"
                                      : "p-4"
                                  }
                                  key={index.id}
                                >
                                  <p className="font-bold text-gray-600 w-full truncate">
                                    {data.ticket_assigned_to_name
                                      ? data.ticket_assigned_to_name
                                      : "Not Assigned"}
                                  </p>
                                </td>
                                {/* condition for ticket status */}
                                <td className="p-4" key={index.id}>
                                  {data.ticket_status === "1" ? (
                                    <p className=" w-full font-bold truncate text-[#a10b00]">
                                      Requested
                                    </p>
                                  ) : data.ticket_status === "2" ? (
                                    <p className=" w-full truncate font-bold text-[#c95b00]">
                                      Assigned
                                    </p>
                                  ) : data.ticket_status === "3" ? (
                                    <p className="w-full truncate font-bold text-[#570075]">
                                      Ongoing
                                    </p>
                                  ) : data.ticket_status === "4" ? (
                                    <p className=" w-full truncate font-bold text-[#007a3f]">
                                      For Checking
                                    </p>
                                  ) : (
                                    <p className="w-full truncate font-bold text-[#363636]">
                                      Done
                                    </p>
                                  )}
                                </td>
                                <td className="p-4 text-center" key={index.id}>
                                  {/* button if role is user and its conditions */}
                                  {role === "user" &&
                                  data.ticket_status === "5" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Details
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "user" &&
                                    data.ticket_status === "4" ? (
                                    // when ticket status is 4 or for checking
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <FiCheckSquare className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Review
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "user" ? (
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowFollowUp(true);
                                        setBumpCode(data.ticket_cde);
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <TbTransfer className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Follow Up
                                        </p>
                                      </div>
                                    </button>
                                  ) : // button if role is admin and its conditions and its conditions
                                  role === "admin" &&
                                    data.ticket_status === "2" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setAdminForm(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
                                        setTicket_assigned_to_name(
                                          data.ticket_assigned_to_name
                                        );
                                        get_ticket_desc(data.ticket_type);
                                        set_request_desc(
                                          data.ticket_desc_concern
                                        );
                                        set_request_type(data.ticket_type);
                                        setID(data.id);
                                        set_ticket_cde(data.ticket_cde);
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RiUserSharedLine className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Assign
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "admin" &&
                                    data.ticket_status === "1" ? (
                                    // when ticket status is 4 or for checking
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setAdminForm(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
                                        setTicket_assigned_to_name(
                                          data.ticket_assigned_to_name
                                        );
                                        get_ticket_desc(data.ticket_type);
                                        set_request_desc(
                                          data.ticket_desc_concern
                                        );
                                        set_request_type(data.ticket_type);
                                        setID(data.id);
                                        set_ticket_cde(data.ticket_cde);
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RiUserSharedLine className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Assign
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "admin" ? (
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Details
                                        </p>
                                      </div>
                                    </button>
                                  ) : // button if role is technical and its conditions
                                  role === "technical" &&
                                    data.ticket_status === "5" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Details
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "technical" &&
                                    data.ticket_status === "2" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Review
                                        </p>
                                      </div>
                                    </button>
                                  ) : (
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowTechForm(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RiEditLine className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Update
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          ) : // data mapping if selected type is all
                          selectedType === "All" ? (
                            <tbody>
                              <tr
                                className="text-xs font-normal even:bg-red-300 hover:bg-[#f6edff] ease-in-out duration-500 cursor-pointer border-b"
                                key={index.id}
                              >
                                <th
                                  scope="row"
                                  className="text-[#24693c] text-start p-4"
                                >
                                  <p className="w-full truncate">
                                    {data.ticket_type}
                                  </p>
                                </th>
                                <td className="p-4" scope="row">
                                  <p className="w-full line-clamp-2">
                                    {data.ticket_desc_concern}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <p className="w-full truncate">
                                    {data.ticket_status_if_date}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <p className="w-full truncate">
                                    {data.ticket_update_date}
                                  </p>
                                </td>
                                <td
                                  className={
                                    !(role === "admin" || role === "technical")
                                      ? "hidden"
                                      : "p-4"
                                  }
                                >
                                  <p className="font-bold text-gray-600 w-full truncate">
                                    {data.ticket_client_name}
                                  </p>
                                </td>
                                <td
                                  className={
                                    !(role === "admin" || role === "user")
                                      ? "hidden"
                                      : "p-4"
                                  }
                                  key={index.id}
                                >
                                  <p className="font-bold text-gray-600 w-full truncate">
                                    {data.ticket_assigned_to_name
                                      ? data.ticket_assigned_to_name
                                      : "Not Assigned"}
                                  </p>
                                </td>

                                <td className="p-4" key={index.id}>
                                  {data.ticket_status === "1" ? (
                                    <p className=" w-full font-bold truncate text-[#a10b00]">
                                      Requested
                                    </p>
                                  ) : data.ticket_status === "2" ? (
                                    <p className=" w-full truncate font-bold text-[#c95b00]">
                                      Assigned
                                    </p>
                                  ) : data.ticket_status === "3" ? (
                                    <p className="w-full truncate font-bold text-[#570075]">
                                      Ongoing
                                    </p>
                                  ) : data.ticket_status === "4" ? (
                                    <p className=" w-full truncate font-bold text-[#007a3f]">
                                      For Checking
                                    </p>
                                  ) : (
                                    <p className="w-full truncate font-bold text-[#363636]">
                                      Done
                                    </p>
                                  )}
                                </td>
                                <td className="p-4 text-center" key={index.id}>
                                  {/* button if role is user and its */}
                                  {role === "user" &&
                                  data.ticket_status === "5" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Details
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "user" &&
                                    data.ticket_status === "4" ? (
                                    // when ticket status is 4 or for checking
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <FiCheckSquare className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Review
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "user" ? (
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowFollowUp(true);
                                        setBumpCode(data.ticket_cde);
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <TbTransfer className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Follow Up
                                        </p>
                                      </div>
                                    </button>
                                  ) : // button if role is admin and its conditions and its conditions
                                  role === "admin" &&
                                    data.ticket_status === "2" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setAdminForm(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
                                        setTicket_assigned_to_name(
                                          data.ticket_assigned_to_name
                                        );
                                        get_ticket_desc(data.ticket_type);
                                        set_request_desc(
                                          data.ticket_desc_concern
                                        );
                                        set_request_type(data.ticket_type);
                                        setID(data.id);
                                        set_ticket_cde(data.ticket_cde);
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RiUserSharedLine className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Assign
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "admin" &&
                                    data.ticket_status === "1" ? (
                                    // when ticket status is 4 or for checking
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setAdminForm(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
                                        setTicket_assigned_to_name(
                                          data.ticket_assigned_to_name
                                        );
                                        get_ticket_desc(data.ticket_type);
                                        set_request_desc(
                                          data.ticket_desc_concern
                                        );
                                        set_request_type(data.ticket_type);
                                        setID(data.id);
                                        set_ticket_cde(data.ticket_cde);
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RiUserSharedLine className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Assign
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "admin" ? (
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Details
                                        </p>
                                      </div>
                                    </button>
                                  ) : // button if role is technical and its conditions
                                  role === "technical" &&
                                    data.ticket_status === "5" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Details
                                        </p>
                                      </div>
                                    </button>
                                  ) : role === "technical" &&
                                    data.ticket_status === "2" ? (
                                    // when ticket status is 5 or done
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowAcceptDenyModal(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RxInfoCircled className="text-sm" />{" "}
                                        <p className="text-xs font-normal truncate">
                                          Review
                                        </p>
                                      </div>
                                    </button>
                                  ) : (
                                    <button
                                      className="bg-[#2f2f2f] text-white py-2 px-3 rounded-md hover:bg-[#474747] ease-in-out duration-500"
                                      onClick={() => {
                                        setShowTechForm(true);
                                        set_name_requester(
                                          data.ticket_client_name
                                        );
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
                                      }}
                                    >
                                      <div className="flex flex-row gap-1 items-center justify-center w-full">
                                        <RiEditLine className="text-sm" />
                                        <p className="text-xs font-normal truncate">
                                          Update
                                        </p>
                                      </div>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          ) : null
                        )
                      // end of mapping
                    )}
                  </table>
                </div>
                {/* div for pagination */}
                {current_page && (
                  <div
                    className="flex flex-row gap-1 items-center justify-end w-full p-12"
                    key={current_page}
                  >
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
                        key={pageNumber.id}
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
                {/* end div for the table contents */}
              </div>
            </div>
          </div>
          {/* start of div for staff overview when role is admin */}
          <div
            className={
              role === "user"
                ? "hidden"
                : role === "technical"
                ? "hidden"
                : "flex w-1/5"
            }
          >
            <div className="w-full max-h-full">
              <div className="bg-[#FAF5FF] flex flex-col rounded-lg antialiased cursor-pointer overflow-hidden">
                <div className="bg-[#2f2f2f] flex items-center py-4 px-6">
                  <p className="text-white text-sm font-semibold">Employees.</p>
                </div>
                <div className="relative py-4 px-6 w-full flex flex-col justify-center items-center">
                  <div className="flex flex-row justify-between pt-2 w-full border-b">
                    <div className="flex items-center w-1/2 justify-start gap-4 py-2 px-4 ">
                      <p className="text-xs font-bold text-gray-500 truncate">
                        Employee
                      </p>
                    </div>
                    <div className="flex items-center justify-end w-1/2 gap-4 py-2 px-4 ">
                      <p className="text-xs font-bold text-gray-500 truncate">
                        Jobs
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-[68vh] pb-8">
                    <div
                      className="w-full h-full overflow-auto scrollbar-hide"
                      ref={containerRef}
                    >
                      {/* mapping the data for the staff overview */}
                      {name.map((names, index) => (
                        <div
                          className="flex flex-row justify-between py-2 px-4 hover:bg-[#f6edff] ease-in-out duration-500 border-b"
                          key={index.id}
                        >
                          <div className="flex items-center justify-start w-1/2 gap-4 py-2">
                            <p className="text-xs font-bold text-[#113e21] truncate ">
                              {names.username}
                            </p>
                          </div>
                          <div className="flex items-center justify-end w-1/2 gap-4 py-2">
                            <p className="text-xs font-semibold text-[#113e21] truncate">
                              {names.job_count}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute  bottom-10 flex flex-row items-center justify-center gap-4">
                    <div
                      className="text-black py-2 px-4 flex items-center justify-center bg-[#f6edff] hover:bg-[#2f2f2f] rounded-lg hover:text-white ease-in-out duration-500 shadow-xl"
                      onClick={() => handleScrollDown(200)}
                    >
                      <p className="text-xs">more..</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end of div for staff overview */}
        </div>

        {/* div flex for division between table and staff overview */}
      </div>

      {/* condition and props for the modals */}
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
        requester_name={name_requester}
        ticket_type={request_type}
        request_desc={request_desc}
        ticket_cde={ticket_cde}
        ticket_desc_remarks={ticket_desc_remarks}
        ticket_desc_findings={ticket_desc_findings}
        ticket_desc_replacement={ticket_desc_replacement}
        onClose={() => setShowTechForm(false)}
      />
      <AcceptDenyModal
        isVisible={showAcceptDenyModal}
        ticketID={ticketID}
        requester_name={name_requester}
        ticket_type={request_type}
        request_desc={request_desc}
        ticket_cde={ticket_cde}
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

export default Large;