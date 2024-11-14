import React, { useState, useEffect } from "react";
import "../SideNav/SideNav.css";
import "boxicons/css/boxicons.min.css";
import { Link, Route, Routes } from "react-router-dom";
import Listing from "../Listing/Listing";
import Cookies from "js-cookie";
import Add_Sub_Admin from "../Add_Sub_Admin/Add_Sub_Admin";
import User_Lead from "../../../User/Components/User_Lead/User_Lead";
import Thank_You_Page from "../../../User/Components/User_Lead/Thank_you/Thank_You_Page";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Admin_Dashboard from "../Admin_Dashboard/Admin_Dashboard";
import Show_Sub_Admin_List from "../Show_Sub_Admin_List/Show_Sub_Admin_List";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Add_Branches from "../Add_Branches/Add_Branches";
import Zula_Category from "../Zula_Category/Zula_Category";
import Add_Products from "../Add_Products/Add_Products";
import Zula_Style from "../Zula_Style_And_Color/Zula_Style";
import Zula_Style_Color from "../Zula_Style_And_Color/Zula_Style_Color";
import { ReactComponent as SwingIcon } from "../SideNav/Assets/Swing.svg";
import StyleIcon from "@mui/icons-material/Style";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import Shop_M_Add_Order from "../Shop_M_Add_Order/Shop_M_Add_Order";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Show_Shop_M_Order from "../Shop_M_Add_Order/Show_Shop_M_Order";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import Shop_M_Add_Order11 from "../Shop_M_Add_Order/Shop_M_Add_Order";
import DynamicForm11 from "../Shop_M_Add_Order/Shop_M_Add_Order_11";
import Shop_M_Edit_Order from "../Shop_M_Add_Order/Shop_M_Edit_Order_11";
import Show_Orders from "../Factory_M/Show_Orders";
import Get_History from "../Shop_M_Add_Order/Get_History";
import Get_Archive_Orders from "../Shop_M_Add_Order/Get_Archive_Orders";
import io from "socket.io-client";
import { API_URL } from "../../../config";
import { toast } from "react-toastify";
import ToastContainer from "rsuite/esm/toaster/ToastContainer";
import song from "../SideNav/samsung.mp3";
// import song from '../SideNav/Jai Kal Mahakal.mp3'
import { Howl } from "howler";
import Edit_Sub_Admin from "../Add_Sub_Admin/Edit_Sub_Admin";
import Get_Notification from "../Get_Notification/Get_Notification";
import chain_type_icon from "./Assets/chain.png";
import Chain_Types from "../Chain_Types/Show_Chain_Types.js";
import logo1 from "./Assets/logo.png";
import Forget_Password from "../Login/Forget_Password.js";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { NotificationAdd, NotificationAddRounded } from "@mui/icons-material";
import Show_Orders2 from "../Factory_M/Show_Orders_2.js";
import Loader from "../../../Loader/Loader.js";
import All_Notifications from "../All_Notifications/All_Notifications.js";
import axios from "axios";
import Filter_Show_Shop_M_Order from "../Shop_M_Add_Order/Filter_Shop_M_Order.js";

const SideNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const socket = io(`${API_URL}`); // Replace with your server URL
  const socket1 = io(`${API_URL}`); // Replace with your server URL
  
  const [ get_count_tot_notifications , set_count_tot_notifications ] = useState(0)

  useEffect(()=>{
    axios.post(`${API_URL}/count_all_notifications` , { order_by : Cookies.get('admin_username') , role : Cookies.get('role') }).then((res)=>{
      if(res.data.success == true){
        set_count_tot_notifications(res.data.data)
      }
    })
  },[])

  useEffect(()=>{ 
  
    socket1.on("all notification", ({ challan_no, order_by })=>{
      // const showNotification = () => {
      //       new Notification("Hello, world!");
      //   };

      //   const requestNotificationPermission = async () => {
      //       // Check if the browser supports notifications
      //       if (!("Notification" in window)) {
      //           console.log("This browser does not support desktop notification");
      //           return;
      //       }

      //       // Request permission to display notifications
      //       let permission = await Notification.requestPermission();

      //       if (permission === "granted") {
      //           showNotification();
      //       } else if (permission === "denied") {
      //           // If permission is denied, try asking again
      //           permission = await Notification.requestPermission();
      //           if (permission === "granted") {
      //               showNotification();
      //           }
      //       }
      //   };

      //   requestNotificationPermission();
      axios.post(`${API_URL}/count_all_notifications` ,  { order_by : Cookies.get('admin_username') , role : Cookies.get('role') }).then((res)=>{
        if(res.data.success == true){
          set_count_tot_notifications(res.data.data)
        }
      })
    })


    return () => {
      if (socket1) {
        socket1.off("all notification");
      }
    };
  },[socket1])

  useEffect(() => {
    // Add event listener when component mounts
    // document.addEventListener("click", handleOutsideClick);

    // Cleanup: remove event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Ensure socket is initialized and connected
    if (Cookies.get("role") === "factory_m" && socket) {
      socket.on("new order notification", (newOrder) => {
        const sound = new Howl({
          src: [song],
        });
        sound.play();
        
        console.log("New Order Received At Factory Manager...");
        toast.success("New Order Received At Factory Manager...");
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("new order notification");
      }
    };
  }, [socket]); // Add 'socket' to the dependency array if socket can change

  useEffect(() => {
    // Ensure socket is initialized and connected

    socket.on("factory manager edit order", ({ challan_no, order_by }) => {
      console.log(
        `Factory Manager edited order ${challan_no} ordered by ${order_by}`
      );
      if (order_by == Cookies.get("admin_username")) {
        const sound = new Howl({
          src: [song],
        });
        sound.play();
        console.log("Factory Manager Change Order...");
        toast.success(
          `Factory Manager edited order ${challan_no} ordered by ${order_by}`
        );
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("factory manager edit order");
      }
    };
  }, [socket]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOutsideClick = (e) => {
    // Check if clicked element is not inside the sidebar
    if (!e.target.closest(".sidebar")) {
      // Close the sidebar
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("id");
    Cookies.remove("city");
    Cookies.remove("admin_name");
    Cookies.remove("admin_username");
    Cookies.remove("area");
    Cookies.remove("role");
    Cookies.remove("state");
    window.location = "/";
  };

  return (
    <div>
      <ToastContainer />
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="logo-details">
          {/* <i className="bx bxl-codepen icon"></i> */}
          <img
            src={logo1}
            alt=""
            className="icon"
            style={{ width: "40px", height: "40px" }}
          />
          <div className="logo_name">The Zula House</div>
          <i className="bx bx-menu" id="btn" onClick={handleToggleSidebar}></i>
        </div>
        <img
          src={logo1}
          alt=""
          className="icon2"
          style={{ width: "40px", height: "40px" }}
        />
        <ul className="nav-list">
          <li>
            <Link to="/dashboard">
              <i className="bx bx-grid-alt"></i>
              <span className="links_name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>

          {/* {Cookies.get("role") == "admin" ? (
            <li class="dropdown sidenav_dropdown">
              <Link
                to="/add_sub_admin"
                class="dropdown-toggle sidenav_swing_icon_container"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  className="sidenav_swing_icon"
                  onClick={() => handleToggleSidebar()}
                >
                  <SwingIcon />
                </i>
                <span className="links_name">Zula</span>
              </Link>
              <span className="tooltip">User</span>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li className="sidenav_zula_sub_icons_container">
                  <Link to="/zula_category">
                    <i class="bx bx-category-alt"></i>{" "}
                    <span className="links_name">Zula Category</span>
                  </Link>
                  <span className="tooltip">Zula Category</span>
                </li>
                <li className="sidenav_zula_sub_icons_container">
                  <Link to="/zula_style">
                    <i>
                      <StyleIcon />
                    </i>
                    <span className="links_name">Zula's Style</span>
                  </Link>
                  <span className="tooltip">Zula's Style</span>
                </li>
                <li className="sidenav_zula_sub_icons_container">
                  <Link to="/zula_style_color">
                    <i>
                      <ColorLensIcon />
                    </i>
                    <span className="links_name">Zula's Color </span>
                  </Link>
                  <span className="tooltip">Zula's Color</span>
                </li>
                <li className="sidenav_zula_sub_icons_container">
                  <Link to="/chain_types">
                    <i>
                      <img
                        src={chain_type_icon}
                        alt=""
                        style={{ width: "30px", height: "30px" }}
                      />
                    </i>
                    <span className="links_name">Chain Type</span>
                  </Link>
                  <span className="tooltip">Chain Type</span>
                </li>
              </ul>
            </li>
          ) : null} */}

          {Cookies.get("role") == "admin" ? (
            <div className="no_of_list">
              <li>
                <Link to="/show_sub_admin_list">
                  <i
                    class="bx bxs-user-circle"
                    style={{ fontSize: "1.4em" }}
                  ></i>
                  <span className="links_name">New Role </span>
                </Link>
                <span className="tooltip">New Role</span>
              </li>
              <li>
                <Link to="/braches_list">
                  <i class="bx bx-store"></i>{" "}
                  <span className="links_name">Our Branches </span>
                </Link>
                <span className="tooltip">Our Branches</span>
              </li>
              <li>
                <Link to="/shop_m_add_order11">
                  <i>
                    <AddShoppingCartIcon />
                  </i>{" "}
                  <span className="links_name">Add Order </span>
                </Link>
                <span className="tooltip">Add Order</span>
              </li>
              <li>
                <a href="/get_shop_m_all_orders">
                  <i>
                    <ViewQuiltIcon />
                  </i>{" "}
                  <span className="links_name">Show Order </span>
                </a>
                <span className="tooltip">Show Order</span>
              </li>
              <li>
                <a href="/get_filter_shop_m_all_orders">
                  <i>
                    <ViewQuiltIcon />
                  </i>{" "}
                  <span className="links_name">Filter Order </span>
                </a>
                <span className="tooltip">Filter Order</span>
              </li>

              <li className="">
                <Link to="/lead_listing">
                  <i>
                    <LeaderboardIcon />
                  </i>
                  <span className="links_name">User Lead List</span>
                </Link>
                <span className="tooltip">User Lead List</span>
              </li>
              <li className="">
                <Link to="/add_products">
                  <i>
                    <InventoryIcon />
                  </i>
                  <span className="links_name">Add Products</span>
                </Link>
                <span className="tooltip">Add Products</span>
              </li>
              <li className="">
                <Link to="/get_archive_order">
                  <i>
                    <InventoryIcon />
                  </i>
                  <span className="links_name">Archive Order</span>
                </Link>
                <span className="tooltip">Archive Order</span>
              </li>

              <li className="">
                <Link to="/get_notification">
                  <i>
                    <CircleNotificationsIcon />
                  </i>
                  <span className="links_name">Order Status</span>
                </Link>
                <span className="tooltip">Order Status</span>
              </li>
            </div>
          ) : (
            <></>
          )}

          {Cookies.get("role") == "shop_m" ? (
            <div className="no_of_list">
              <li>
                <Link to="/shop_m_add_order11">
                  <i>
                    <AddShoppingCartIcon />
                  </i>{" "}
                  <span className="links_name">Add Order </span>
                </Link>
                <span className="tooltip">Add Order</span>
              </li>
              <li>
                <Link to="/get_shop_m_all_orders">
                  <i>
                    <ViewQuiltIcon />
                  </i>{" "}
                  <span className="links_name">Show Order </span>
                </Link>
                <span className="tooltip">Show Order</span>
              </li>

              <li className="">
                <Link to="/lead_listing">
                  <i>
                    <LeaderboardIcon />
                  </i>
                  <span className="links_name">User Lead List</span>
                </Link>
                <span className="tooltip">User Lead List</span>
              </li>
            </div>
          ) : (
            <></>
          )}

          {Cookies.get("role") == "factory_m" ? (
            <div className="no_of_list">
              <li>
                <a href="/show_factory_m_orders?">
                  <i>
                    <ViewQuiltIcon />
                  </i>{" "}
                  <span className="links_name">Show Order </span>
                </a>
                <span className="tooltip">Show Order</span>
              </li>
              <li className="">
                <Link to="/get_notification">
                  <i>
                    <CircleNotificationsIcon />
                  </i>
                  <span className="links_name">Order Status</span>
                </Link>
                <span className="tooltip">Order Status</span>
              </li>
            </div>
          ) : (
            <></>
          )}
          <li
            className="profile"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <div className="profile-details">
              <i className="bx bx-export"></i>
              <div className="name_job">
                <div className="name">Logout</div>
              </div>
            </div>
            <i className="bx bx-log-out" id="log_out"></i>
          </li>
        </ul>
      </div>
      <section className="home-section">
        <div className="top_navbar_container">
          <li className="" style={{ textAlign: "end", marginRight: "40px" }}>
            <Link to="/get_all_notification" style={{ textDecoration : "none" }}>
              <i>
                <CircleNotificationsIcon
                  style={{
                    fontSize: "2.2em",
                    color: "white",
                    marginTop: "10px",
                  }}
                />
                {/* <div className="top_nav_notification_container"></div> */}
                <span className="top_nav_notification_container"><span className="top_nav_notification_txt">{get_count_tot_notifications}</span></span>
              </i>
            </Link>
          </li>
        </div>

        <Routes>
          {Cookies.get("role") == "admin" ? (
            <>
              <Route path="/add_sub_admin" element={<Add_Sub_Admin />} />
              <Route path="/loader" element={<Loader />} />
              <Route path="/edit_sub_admin" element={<Edit_Sub_Admin />} />
              <Route path="/braches_list" element={<Add_Branches />} />
              <Route path="/zula_category" element={<Zula_Category />} />
              <Route path="/zula_style" element={<Zula_Style />} />
              <Route path="/zula_style_color" element={<Zula_Style_Color />} />
              <Route path="/add_products" element={<Add_Products />} />
              <Route path="/shop_m_add_order11" element={<DynamicForm11 />} />
              <Route
                path="/get_shop_m_all_orders"
                element={<Show_Shop_M_Order />}
              />
              <Route path="/show_factory_m_orders" element={<Show_Orders />} />
              <Route
                path="/shop_m_edit_order"
                element={<Shop_M_Edit_Order />}
              />
              <Route
                path="/show_sub_admin_list"
                element={<Show_Sub_Admin_List />}
              />
              <Route path="/lead_listing" element={<Listing />} />
              <Route path="/dashboard" element={<Admin_Dashboard />} />
              <Route path="/get_order_history" element={<Get_History />} />
              <Route path="/chain_types" element={<Chain_Types />} />
              <Route
                path="/get_archive_order"
                element={<Get_Archive_Orders />}
              />
              {/* this below is for get all order by deadline */}

              <Route path="/get_notification" element={<Get_Notification />} />

              {/* this below is for get all notifiaction */}

              <Route
                path="/get_all_notification"
                element={<All_Notifications />}
              />
               <Route
                path="/get_filter_shop_m_all_orders"
                element={<Filter_Show_Shop_M_Order />}
              />
            </>
          ) : null}

          {/* <Route path="/dashboard" element={<Admin_Dashboard />} /> */}
        </Routes>
        <Routes>
          {Cookies.get("role") == "shop_m" ? (
            <>
              <Route path="/lead_listing" element={<Listing />} />
              <Route path="/shop_m_add_order11" element={<DynamicForm11 />} />
              <Route
                path="/get_shop_m_all_orders"
                element={<Show_Shop_M_Order />}
              />
              <Route
                path="/shop_m_edit_order"
                element={<Shop_M_Edit_Order />}
              />
              <Route path="/dashboard" element={<Admin_Dashboard />} />
              <Route path="/get_order_history" element={<Get_History />} />
              <Route
                path="/get_archive_order"
                element={<Get_Archive_Orders />}
              />
              <Route
                path="/get_all_notification"
                element={<All_Notifications />}
              />
            </>
          ) : null}

          {Cookies.get("role") == "factory_m" ? (
            <>
              <Route path="/dashboard" element={<Admin_Dashboard />} />
              <Route path="/get_order_history" element={<Get_History />} />
              <Route path="/show_factory_m_orders" element={<Show_Orders />} />
              <Route path="/get_notification" element={<Get_Notification />} />
              <Route
                path="/show_factory_m_orders2"
                element={<Show_Orders2 />}
              />
              <Route
                path="/get_all_notification"
                element={<All_Notifications />}
              />
            </>
          ) : null}

          <Route path="/user_lead" element={<User_Lead />} />
          <Route path="/thank_you" element={<Thank_You_Page />} />

          {/* <Route path="/dashboard" element={<Admin_Dashboard />} /> */}
        </Routes>
      </section>
    </div>
  );
};

export default SideNav;
