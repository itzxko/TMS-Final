import React from "react";
import { useState, useEffect } from "react";

// importing json for tickets
import ticketType from "../../JSON/Tickets.json";

// importing json for roles
import roles from "../../JSON/Roles.json";

// importing icons
import { BiTimer } from "react-icons/bi";
import { TbCalendarTime } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { CgMathPlus } from "react-icons/cg";
import { BiSearch } from "react-icons/bi";
import { RiUserSettingsLine } from "react-icons/ri";
import { HiOutlineTicket } from "react-icons/hi2";
import { FaCodeMerge } from "react-icons/fa6";
import { LuSettings2 } from "react-icons/lu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { LiaExclamationSolid } from "react-icons/lia";

// importing popup modals
import UserModal from "../UserModal";
import TechModal from "../TechModal";
import axiosClient from "../../axios";
import AdminModal from "../AdminModal";
import Navbar from "../Navbar";
import FollowUp from "../Popups/FollowUp";
import useRole from "../customHooks/useRole";

const Small = () => {
  const [ticketID, setTicketID] = useState(false);

  // use state for toggling filter
  const [filter, setFilter] = useState(false);

  // use state for toggling type filter
  const [openType, setOpenType] = useState(false);

  // use state for setting the selected type
  const [selectedType, setSelectedType] = useState("All");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTechForm, setShowTechForm] = useState(false);
  const [showAdminForm, setAdminForm] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [id, setID] = useState("");

  // use state for setting the selected role
  const [selectedRole, setSelectedRole] = useState("user");
  // const [role, setRole] = useState("");

  // use state for toggling role filter
  const [openRole, setOpenRole] = useState(false);
  const [pendingTicket, setPendingTicket] = useState([]);
  const [request_type, set_request_type] = useState("");
  const [request_desc, set_request_desc] = useState("");
  const [tech_name, set_tech_name] = useState([]);
  const [ticket_cde, set_ticket_cde] = useState([]);
  const [userName, setUserName] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [bumpCode, setBumpCode] = useState("");

  // const [currentPage, setCurrentPage] = useState(1);
  const [current_page, set_current_page] = useState(null);
  const [pages, setPages] = useState(null);

  const {role} = useRole();
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

  useEffect(() => {
    axiosClient
      .get(`http://localhost:8000/api/pending-ticket?page=${current_page}`)
      .then((res) => {
        setPendingTicket(res.data.Message.data);
      });
  }, [current_page]);

  //For Welcome Back User
  // useEffect(() => {
  //   axiosClient
  //     .get("/get_user")
  //     .then((res) => {
  //       setUserName(res.data.username);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const handleSearch = () => {
    setOpenSearch(!openSearch);
    // console.log(openSearch);
    setFilter(false);
  };

  // Check if there are tickets of the selected type
  const hasTicketsOfType =
    selectedType === "All" ||
    pendingTicket.some((data) => data.ticket_type === selectedType);

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
    // console.log(`type value below: ${openType}`);
  };

  //For Welcome Back User
  useEffect(() => {
    axiosClient
      .get("/get_user")
      .then((res) => {
        setUserName(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // setting the selected role
  const handleRole = (roles, id) => {
    role === roles ? setSelectedRole("user") : setSelectedRole(roles);
    setOpenRole(false);
  };

  // const bump = (code) => {
  //   axiosClient
  //     .post("/follow-up", {
  //       ticket_cde: code,
  //     })
  //     .then(() => {
  //       location.reload();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // Toggle role dropdown
  const handleOpenRole = () => {
    setOpenRole(!openRole);
    setOpenType(false);
  };

  // Fetch ticket descriptions for selected ticket type
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
    selectedType === type ? setSelectedType("All") : setSelectedType(type);
    setOpenType(false);
  };

  // Fetch initial data on component mount
  useEffect(() => {
    axiosClient
      .get("/ticket")
      .then((res) => {
        setData(res.data.Message);
        setLoading(true);
      })
      .catch((err) => console.log(err));

    axiosClient
      .get("/pending-ticket")
      .then((res) => {
        // console.log(res.data.role);
        return res.data.Message;
      })
      .then((res) => {
        setPendingTicket(res.data);
        // setRole(res.role);
      })
      .catch((err) => console.log(err));
  }, []);

  // Filtering Pending Ticket
  useEffect(() => {
    axiosClient
      .get(`/pending-ticket/${selectedType}`)
      .then((res) => {
        return res.data;
      })
      .then((res) => res.data)
      .then((res) => {
        // console.log(res.Message.last_page);
        // console.log(res.Message.current_page)
        set_current_page(res.Message.current_page);
        setPages(res.Message.last_page);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedType]);

  //Render Page
  return (
    <>
      <Navbar selectedRole={role} />
      {/* gray background page for the body */}
      <div className="block lg:hidden bg-[#ebebeb] min-h-[100vh] w-full px-6 md:px-8 lg:px-12 pb-6 font-dm">
        {/* for large screen and beyond */}
        <div className="block lg:hidden py-10"></div>
        <div className="flex flex-col w-full lg:hidden">
          <div className="">
            {/* div for welcome note and filter, add and role buttons */}
            <div className="flex flex-row gap-2 justify-between items-center py-2">
              <div className="flex">
                <p className="text-xs font-bold text-[#113e21] truncate">
                  Hi, {localStorage.getItem("username")}!
                </p>
              </div>

              <div className="flex flex-row justify-center py-4 items-center gap-2">
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
                    <div className="relative w-full flex flex-justify justify-start items-start">
                      <div
                        className="flex flex-row-reverse gap-1 items-center justify-end bg-[#FAF5FF] hover:bg-gray-100 ease-in-out duration-700 w-full h-full cursor-pointer px-4 py-2 rounded-t-lg"
                        onClick={handleOpenRole}
                      >
                        <div className="text-center">
                          <p className="text-xs font-normal">Role</p>
                        </div>
                        <div className="flex items-center justify-center text-sm">
                          {openRole ? <MdClose /> : <RiUserSettingsLine />}
                        </div>
                      </div>
                      <div
                        className={
                          openRole
                            ? "absolute bg-[#FAF5FF] rounded-lg flex flex-col justify-center items-center left-[-94px] shadow-lg overflow-hidden"
                            : "hidden"
                        }
                      >
                        {roles.map((role, index) => (
                          <div
                            key={role.id}
                            className={
                              role === role.role
                                ? "cursor-pointer bg-[#2f2f2f] text-white w-full py-2 px-4"
                                : "cursor-pointer bg-[#FAF5FF] text-black hover:bg-gray-100 w-full py-2 px-4"
                            }
                            onClick={() => handleRole(role.role, role.id)}
                          >
                            <p className="text-xs font-normal truncate">
                              {role.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative w-full flex flex-col justify-start items-end">
                      <div
                        className="flex flex-row-reverse gap-1 items-center justify-end bg-[#FAF5FF] hover:bg-gray-100 ease-in-out duration-700 w-full  h-full cursor-pointer px-4 py-2 rounded-b-lg"
                        onClick={handleOpenType}
                      >
                        <div className="text-center">
                          <p className="text-xs font-normal">Type</p>
                        </div>
                        <div className="flex items-center justify-center text-sm">
                          {openType ? <MdClose /> : <HiOutlineTicket />}
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
                {/* end of add ticket button */}
              </div>
            </div>
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
                    .filter((data) => {
                      return search.toLowerCase() === ""
                        ? data
                        : data.ticket_type.toLowerCase().includes(search) ||
                            data.ticket_desc_concern
                              .toLowerCase()
                              .includes(search);
                    })
                    .filter((data) => {
                      if (role === "technical") {
                        return data.ticket_assigned_to_name === localStorage.getItem("username");
                      } else if (role === "user") {
                        return data.ticket_client_name === localStorage.getItem("username");
                      }
                      return true;
                    })
                    .map((data, index) =>
                      data.ticket_type === selectedType ? (
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
                                  <p className="text-xs font-bold text-[#113e21] capitalize truncate">
                                    {data.ticket_status === "1"
                                      ? "Requested"
                                      : data.ticket_status === "2"
                                      ? "Assigned"
                                      : data.ticket_status === "3"
                                      ? "Ongoing"
                                      : data.ticket_status === "4"
                                      ? "For Checking"
                                      : "Done"}
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
                              {role === "user" && data.ticket_status === "5" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Follow Up
                                  </p>
                                </button>
                              ) : role === "user" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
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
                              ) : role === "admin" &&
                                data.ticket_status === "5" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" &&
                                data.ticket_status === "4" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setAdminForm(true);
                                      get_ticket_desc(data.ticket_type);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      setID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                    }}
                                  >
                                    Assign
                                  </p>
                                </button>
                              ) : role === "technical" &&
                                data.ticket_status === "5" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Update
                                  </p>
                                </button>
                              ) : role === "technical" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
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
                                    }}
                                  >
                                    Update
                                  </p>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : selectedType === "All" ? (
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
                                  <p className="text-xs font-bold text-gray-500 capitalize truncate">
                                    {data.ticket_status === "1"
                                      ? "Requested"
                                      : data.ticket_status === "2"
                                      ? "Assigned"
                                      : data.ticket_status === "3"
                                      ? "Ongoing"
                                      : data.ticket_status === "4"
                                      ? "For Checking"
                                      : "Done"}
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
                              {role === "user" && data.ticket_status === "5" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Follow Up
                                  </p>
                                </button>
                              ) : role === "user" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
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
                              ) : role === "admin" &&
                                data.ticket_status === "5" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" &&
                                data.ticket_status === "4" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500disabled">
                                  <p className="text-xs font-semibold ">
                                    Assign
                                  </p>
                                </button>
                              ) : role === "admin" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
                                  <p
                                    className="text-xs font-semibold "
                                    onClick={() => {
                                      setAdminForm(true);
                                      get_ticket_desc(data.ticket_type);
                                      set_request_desc(
                                        data.ticket_desc_concern
                                      );
                                      set_request_type(data.ticket_type);
                                      setID(data.id);
                                      set_ticket_cde(data.ticket_cde);
                                    }}
                                  >
                                    Assign
                                  </p>
                                </button>
                              ) : role === "technical" &&
                                data.ticket_status === "5" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500 disabled">
                                  <p className="text-xs font-semibold ">
                                    Update
                                  </p>
                                </button>
                              ) : role === "technical" ? (
                                <button className="bg-[#474747] w-full text-white py-3 rounded-md hover:bg-[#474747] ease-in-out duration-500">
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
            <div className="flex justify-center gap-2 py-4">
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
      <AdminModal
        isVisible={showAdminForm}
        ticket_type={request_type}
        ticket_cde={ticket_cde}
        request_desc={request_desc}
        data={tech_name}
        id={id}
        onClose={() => setAdminForm(false)}
      />
      <TechModal
        isVisible={showTechForm}
        ticketID={ticketID}
        ticket_type={request_type}
        request_desc={request_desc}
        ticket_cde={ticket_cde}
        onClose={() => setShowTechForm(false)}
      />
    </>
  );
};

export default Small;
