import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import $ from "jquery";
import { API_URL } from "../../../config";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import EditIcon from "@mui/icons-material/Edit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import CancelIcon from "@mui/icons-material/Cancel";
import "../Get_Notification/Get_Notification.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Loaderrr from "../../../Loader/Loader";

const Get_Notification = () => {
  const [get_notifications, set_notifications] = useState([]);
  const tableRef = useRef(null);
  const [filterValue, setFilterValue] = useState(""); // State to hold the selected filter value
  const [searchValue, setSearchValue] = useState(""); // State to hold the search input value
  const [get_loader, set_loader] = useState(false);


  const handle_all_notification = async () => {
    set_loader(true)

    const response = await axios.post(`${API_URL}/get_notifications`);
    if (response.data.success === true) {
      set_loader(false)
      // set_notifications(response.data.data[get_days_name]);
      set_notifications(response.data.data);
    }
  };

  useEffect(() => {
    // handle_get_notifications();
    handle_all_notification();
  }, []);

  const [get_images, set_images] = useState([]);

  const handle_get_images = async (e, data) => {
    // e.preventDefault();
    console.log(data);
    set_images(data);
  };

  // const handle_get_history = async(e,order_id)=>{
  //   e.preventDefault()
  //   Cookies.set("get_history_id" , order_id)
  //   window.location.href = '/get_order_history'
  // }

  const [get_order_history, set_order_history] = useState([]);

  const handle_get_history = async (e, id) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_URL}/get_history_of_order`, {
        id: id,
      });
      if (response.data.success === true) {
        console.log(response.data.data);
        set_order_history(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [selectedDays, setSelectedDays] = useState("_0_3_daysNotification");
  const handle_get_notifications = async (days) => {
    // handle_get_notifications();
    setSelectedDays(days);
    // console.log("Selected Days:", days); // Add this line
  };

  useEffect(() => {
    let filteredData = get_notifications;

    if (selectedDays !== null) {
      switch (selectedDays) {
        case "_0_3_daysNotification":
          filteredData = get_notifications._0_3_daysNotification;
          break;
        case "_4_6_daysNotification":
          filteredData = get_notifications._4_6_daysNotification;
          break;
        case "_7_10_daysNotification":
          filteredData = get_notifications._7_10_daysNotification;
          break;
        default:
          filteredData = [];
      }
    }
    console.log("aaaaaaaaaaaa", filteredData);
    if (filteredData) {
      if ($.fn.DataTable.isDataTable("#myTable")) {
        // If DataTable is already initialized, destroy it
        $("#myTable").DataTable().destroy();
      }

      tableRef.current = $("#myTable").DataTable({
        // DataTable initialization options
        data: filteredData,
        columns: [
          {
            title: "No.",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
            width: "5px",
          },
          { title: "Challan No", data: "challan_no", width: "10px" },
          {
            title: "Order Date",
            data: "order_date",
            render: function (data, type, row) {
              // Format the date as dd-mm-yyyy
              const date = new Date(data);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
              return formattedDate;
            },
          },
          {
            title: "Full Name",
            data: "full_name",
            width: "400px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "City",
            data: "o_city",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Phone No",
            data: "ph_no",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Status",
            data: "status",
            width: "40px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Actions",
            data: null,
            width: "40px",
          },
        ],
        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div>
              <div class="dropdown">
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column-reverse",
                  }}
                >
                  <MoreHorizIcon />
                </button>
                <ul
                  class="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                  style={{ padding: "20px" }}
                >
                  <li>
                    {" "}
                    <button
                      className="btn btn-success w-100 mb-3"
                      onClick={(e) => set_orderInfo(data)}
                      data-bs-toggle="modal"
                      data-bs-target="#showImagesModal"
                      style={{ marginRight: "1vw" }}
                    >
                      View
                    </button>
                  </li>
                  <li>
                    {" "}
                    <button
                      className="btn btn-warning w-100 mb-3"
                      onClick={(e) => handle_get_history(e, data.order_id)}
                      data-bs-toggle="modal"
                      data-bs-target="#showHistoryModal"
                      style={{ marginRight: "1vw" }}
                    >
                      History
                    </button>
                  </li>
                </ul>
              </div>{" "}
            </div>,
            row.cells[row.cells.length - 1] // Render buttons in the last cell
          );
        },
      });
    }
  }, [get_notifications, selectedDays]);

  const handle_edit_order_status = async (e, data) => {
    data.status = "cancel";
    console.log("first", data);

    e.preventDefault();

    const ans = window.confirm("Are You Sure ???");

    if (ans) {
      data.update_log = `Go To Archive On ${new Date().toLocaleDateString()}`;

      await axios
        .post(`${API_URL}/edit_shop_m_order_info`, data)
        .then((res) => {
          if (res.data.success == true) {
            toast.success(`${res.data.data}`, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            window.location.href = "/get_shop_m_all_orders";
          } else {
            toast.error(`${res.data.data}`, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        });
    }
  };
  const captureContent = async () => {
    const content = document.getElementById("myTable1"); // Replace 'myTable1' with the id of the element you want to capture
    const canvas = await html2canvas(content, {
      scale: 2, // Increase scale for higher resolution
      logging: true, // Enable logging to troubleshoot any issues
      scrollY: -window.scrollY, // Correct scroll offset
      windowWidth: document.documentElement.offsetWidth, // Use document width
      windowHeight: document.documentElement.offsetHeight, // Use document height
      allowTaint: true, // Allow images from other domains
      useCORS: true, // Enable cross-origin resource sharing
    });
    return canvas;
  };

  const generatePDF = async () => {
    const canvas = await captureContent();
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("table.pdf");
  };

  const handle_edit_order = async (e, data) => {
    Cookies.set("id_for_edit_order", data);
    window.location.href = "/shop_m_edit_order";
  };

  useEffect(() => {
    // Perform search based on selected filter criteria and input value
    if (tableRef.current) {
      tableRef.current.search(searchValue).draw();
    }
  }, [searchValue]);

  useEffect(() => {
    // Update the search value when the filter value changes
    setSearchValue("");
  }, [filterValue]);

  const [get_orderInfo, set_orderInfo] = useState([]);

  return (
    <center>
            {get_loader ? <Loaderrr /> : null}

      <h3
        style={{
          fontFamily: "poppins",
          textAlign: "start",
          paddingLeft: "34px",
          marginBottom: "20px",
        }}
      >
        Orders Status{" "}
      </h3>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "34px",
          paddingRight: "34px",
        }}
      >
        <FormControl variant="outlined" style={{ width: "10vw" }}>
          <InputLabel id="filter-label">Filter By Days</InputLabel>
          <Select
            labelId="filter-label"
            id="filter-select"
            value={filterValue}
            onChange={(e) => handle_get_notifications(e.target.value)}
            label="Filter By"
          >
            <MenuItem value={"_0_3_daysNotification"}>3 Days</MenuItem>
            <MenuItem value={"_4_6_daysNotification"}>5 Days</MenuItem>
            <MenuItem value={"_7_10_daysNotification"}>10 Days</MenuItem>
            {/* Add more filter options if needed */}
          </Select>
        </FormControl>
      </div>
      <div className="show_all_admin_container">
        <div>
          {selectedDays == "_0_3_daysNotification"
            ? "3 Days Notification"
            : selectedDays == "_4_6_daysNotification"
            ? "4-6 Days Notification"
            : selectedDays == "_7_10_daysNotification"
            ? "7-10 Days Notification"
            : null}
        </div>
        <div className="table1">
          <table
            id="myTable"
            className="display table table-striped"
            style={{ width: "100%", textWrap: "nowrap" }}
          >
            <thead className="thead-dark">
              <tr></tr>
            </thead>
          </table>
        </div>
      </div>

      {/* <div
        class="modal fade"
        id="showImagesModal"
        tabindex="-1"
        aria-labelledby="showImagesModal"
        aria-hidden="true"
      >
        <div class="modal-dialog" style={{ zIndex: "1000" }}>
          <div class="modal-content" style={{display:"flex",flexWrap:'wrap',gap:"20px",width:"600px"}}>
            <div class="modal-header">
              <h1
                class="modal-title fs-5"
                id="exampleModalLabel"
                style={{ fontFamily: "poppins" }}
              >
                Add New Branches
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {get_images.map((data1) => {
                return (
                  <>
                  
                    <img
                      src={`${API_URL}/uploads/${data1.imageName}`}
                      alt=""
                      className="m-2"
                      style={{width:"300px",height:"280px"}}
                    />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div> */}

      <div
        class="modal fade"
        id="showHistoryModal"
        tabindex="-1"
        aria-labelledby="showHistoryModal"
        aria-hidden="true"
      >
        <div class="modal-dialog" style={{ zIndex: "1000" }}>
          <div
            class="modal-content"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              width: "600px",
            }}
          >
            <div class="modal-header">
              <h1
                class="modal-title fs-5"
                id="exampleModalLabel"
                style={{ fontFamily: "poppins" }}
              >
                History Information
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              {/* <p className="show_order_info_titles">Order Information:-</p> */}

              <div className="show_order_details_container11">
                {get_order_history.map((data1) => {
                  return (
                    <table
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid black",
                        padding: "5px",
                        width: "100%",
                      }}
                      className="mb-3"
                    >
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                            }}
                          >
                            <tr>
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                  width: "40px",
                                }}
                              >
                                {new Date(data1.createdAt).toLocaleDateString()}
                              </td>
                              <td
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: data1.update_log.replace(
                                    /\n/g,
                                    "<br>"
                                  ),
                                }}
                              ></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="showImagesModal"
        tabindex="-1"
        aria-labelledby="showImagesModal"
        aria-hidden="true"
      >
        <div class="modal-dialog" style={{ zIndex: "1000" }}>
          <div
            class="modal-content"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              width: "600px",
            }}
          >
            <div class="modal-header">
              <h1
                class="modal-title fs-5"
                id="exampleModalLabel"
                style={{ fontFamily: "poppins" }}
              >
                Order Information
              </h1>
              <button
                onClick={generatePDF}
                className="btn btn-outline-warning"
                style={{ margin: "0", marginLeft: "21px" }}
              >
                Generate PDF
              </button>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body" id="myTable1">
              {/* <p className="show_order_info_titles">Order Information:-</p> */}
              <center
                style={{
                  fontSize: "1.2em",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "10px",
                }}
                className="mb-3 p-1"
              >
                Personal Information
              </center>

              <div className="show_order_details_container11">
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    padding: "5px",
                    width: "100%",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      <table>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                              width: "100%",
                            }}
                          >
                            Challan No:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.challan_no}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Order Date:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >{`${new Date(
                            get_orderInfo.order_date
                          ).getDate()}/${new Date(
                            get_orderInfo.order_date
                          ).getMonth()}/${new Date(
                            get_orderInfo.order_date
                          ).getFullYear()}`}</td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Phone No:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.ph_no}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Full Name:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.full_name}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                      }}
                      colSpan={2}
                    >
                      Address:- {get_orderInfo.addr}
                    </td>
                    <td></td>
                  </tr>
                </table>
              </div>

              <center
                style={{
                  fontSize: "1.2em",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "10px",
                }}
                className="mb-3 p-1 mt-3"
              >
                Zula Information
              </center>
              <div className="show_order_details_container11">
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    padding: "5px",
                    width: "100%",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Zula Category:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.zula_category}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Zula Style:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.zula_style}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Pillow Color:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.pillow_color}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Pillow Fabric:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.pillow_fabric}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Cusion Color:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.cusion_color}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Cusion Fabric:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.cusion_fabric_type}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Chain Type:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.chain_type}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Zula Color:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.zula_color}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Zula Size:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.zula_size}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Pillow Quantity:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.pillow_qty}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Pillow Size:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.pillow_size}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Cusion Seat Color:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.cusion_seat_color}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Cusion Back Color:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.cusion_back_color}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Chain Size:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.chain_size}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <center
                style={{
                  fontSize: "1.2em",
                  backgroundColor: "#f3f3f3",
                  borderRadius: "10px",
                }}
                className="mb-3 p-1 mt-3"
              >
                Other Information
              </center>

              <div className="show_order_details_container11">
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    padding: "5px",
                    width: "100%",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Special Accessories:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.special_accessories}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Note:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.note_msg}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Price:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.price}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Customer Delivery:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >{`${new Date(
                            get_orderInfo.customer_delivery_time
                          ).getDate()}/${new Date(
                            get_orderInfo.customer_delivery_time
                          ).getMonth()}/${new Date(
                            get_orderInfo.customer_delivery_time
                          ).getFullYear()}`}</td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            Status:-
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {get_orderInfo.status}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="show_multiple_images_container mt-3">
                {get_orderInfo.length >= 0
                  ? null
                  : get_orderInfo.images.map((data) => (
                      <div key={data._id}>
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            // backgroundColor: "black",
                            background: `url('${API_URL}/uploads/${data.imageName}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        ></div>
                      </div>
                    ))}
              </div>
              {/* <div className="show_multiple_images_container">
  {get_orderInfo && get_orderInfo.length >= 0 && get_orderInfo.images && get_orderInfo.images.length > 0 ? (
    get_orderInfo.images.map((data) => (
      <div key={data._id}>
        <div
          style={{
            width: "150px",
            height: "150px",
            // backgroundColor: "black",
            background: `url('${API_URL}/uploads/${data.imageName}')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    ))
  ) : (
    <div>No images available</div>
  )}
</div> */}
            </div>
          </div>
        </div>
      </div>
    </center>
  );
};

export default Get_Notification;
