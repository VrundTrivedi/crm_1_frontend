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
import { Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import EditIcon from "@mui/icons-material/Edit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import CancelIcon from "@mui/icons-material/Cancel";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DatePicker, Loader } from "rsuite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Loaderrr from "../../../Loader/Loader";

const All_Notifications = () => {
  const [subAdminData, setSubAdminData] = useState([]);
  const tableRef = useRef(null);
  const [filterValue, setFilterValue] = useState(""); // State to hold the selected filter value
  const [searchValue, setSearchValue] = useState(""); // State to hold the search input value

  const captureContent = async () => {
    const content = document.getElementById("myTable1");

    // Hide the price column before capturing the content
    // const priceCells = content.querySelectorAll(".price-column");
    // priceCells.forEach(cell => {
    //   cell.style.display = "none";
    // });
    await $(".price-column").hide();
    const canvas = await html2canvas(content, {
      scale: 3,
      logging: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      allowTaint: true,
      useCORS: true,
    });
    await $(".price-column").show();

    // Show the price column again after capturing the content
    // priceCells.forEach(cell => {
    //   cell.style.display = ""; // Reset to default display property
    // });

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

  const [get_loader, set_loader] = useState(false);
  const navigate = useNavigate();
  const generatePDF2 = async (data) => {
    await set_orderInfo(data);
    set_loader(true);
    setTimeout(async () => {
      const canvas = await captureContent();
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("table.pdf");
      window.location.href = "/get_shop_m_all_orders";
      set_loader(false);
    }, 2000);
  };

  const get_all_notification = async () => {
    try {
      set_loader(true)
      const response = await axios.post(`${API_URL}/get_all_notification`, {
        order_by: Cookies.get("admin_username"),
        role: Cookies.get("role"),
      });
      if (response.data.success === true) {
        set_loader(false)
        setSubAdminData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    get_all_notification();
  }, []);

  const [get_images, set_images] = useState([]);

  const [get_order_history, set_order_history] = useState([]);

  const [get_status, set_status] = useState([
    { status: "pending" },
    { status: "in-process" },
    { status: "shipping" },
    { status: "deliverd" },
  ]);

  const handle_delete_notification = async (id) => {
    await axios
      .post(`${API_URL}/delete_notification_status`, { _id: id })
      .then((res) => {
        if (res.data.success == true) {
          window.location.href = "/get_all_notification";
          toast.success("Notification Removed...");
        }
      });
  };

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };

    if (subAdminData.length > 0 && !tableRef.current) {
      const showValue = getQueryParam("show");
      tableRef.current = $("#myTable").DataTable({
        // responsive: true,
        data: subAdminData,
        columns: [
          {
            title: "No.",
            data: null,
            width: "50px",
            render: (data, type, row, meta) => meta.row + 1,
          },
          {
            title: "Challan No",
            data: "challan_no",
            width: "10px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Order Date",
            data: "createdAt",
            width: "100px",
            render: function (data, type, row) {
              // Check if data is null
              if (!data) {
                return "-";
              }

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
            title: "Message",
            data: "msg",
            width: "900px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Order By",
            data: "order_by",
            width: "50px",
            render: (data) => data || "-", // Handle missing data
          },

          {
            title: "Actions",
            data: null,
            width: "10px",
            render: (data) => data || "-", // Handle missing data
          },
        ],

        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div style={{ whiteSpace: "pre-line" }}>{data.msg}</div>,
            row.cells[row.cells.length - 3] // Render buttons in the last cell
          );
          ReactDOM.render(
            <div>
              <button
                className="btn btn-danger"
                onClick={() => handle_delete_notification(data._id)}
              >
                <CancelIcon />
              </button>
            </div>,
            row.cells[row.cells.length - 1] // Render buttons in the last cell
          );
        },
      });
      if (showValue !== null) {
        tableRef.current.search(showValue).draw();
      }
    }
  }, [subAdminData]);

  const handle_edit_order_status = async (e, data) => {
    data.status = "cancel";
    console.log("first", data);

    e.preventDefault();

    const ans = window.confirm("Are You Sure ???");

    if (ans) {
      data.update_log += `\nGo To Archive On ${new Date().toLocaleDateString()}`;

      await axios.post(`${API_URL}/factory_m_edit_order`, data).then((res) => {
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

  const handle_edit_order = async (e, data) => {
    Cookies.set("id_for_edit_order", data);
    window.location.href = "/shop_m_edit_order";
  };

  useEffect(() => {
    // Perform search based on selected filter criteria and input value
    if (tableRef.current) {
      tableRef.current.search(searchValue).draw();
      // tableRef.current.column('order_date:name').search(searchValue).draw();
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
          paddingLeft: "42px",
          marginBottom: "20px",
        }}
      >
        All Orders{" "}
      </h3>
      <div style={{ textAlign: "start", marginLeft: "50px" }}>
        {" "}
        <DatePicker
          className="datepick"
          popperPlacement="left"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport",
            },
          }}
          placeholder="Filter For Order Date"
          onChange={(date) => {
            if (date) {
              const formattedDate = date
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");
              setSearchValue(formattedDate);
              tableRef.current.column(2).search(formattedDate).draw(); // Assuming 'order_date' is at index 2
            } else {
              setSearchValue("");
              tableRef.current.column(2).search("").draw(); // Clear the search value
            }
          }}
        />
        <DatePicker
          className="datepick"
          popperPlacement="left"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport",
            },
          }}
          placeholder="Filter For Customer Delivery Date"
          style={{ width: "280px" }}
          onChange={(date) => {
            if (date) {
              const formattedDate = date
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");
              setSearchValue(formattedDate);
              tableRef.current.column(6).search(formattedDate).draw(); // Assuming 'customer_delivery_date' is at index 5
            } else {
              setSearchValue("");
              tableRef.current.column(6).search("").draw(); // Clear the search value
            }
          }}
        />
      </div>
      <div className="show_all_admin_container">
        <div className="table1">
          <table
            id="myTable"
            className="display table table-striped"
            style={{ width: "100%", textWrap: "nowrap" }}
          >
            <thead className="thead-dark"></thead>
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
                      {data1.update_log.split("\n").map((line) => (
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
                                  {new Date(
                                    data1.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "5px",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: line,
                                  }}
                                ></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      ))}
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
            <div
              class="modal-body"
              id="myTable1"
              style={{ fontSize: "14px", lineHeight: "1" }}
            >
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
                              width: "200px",
                            }}
                          >
                            {/* {`${new Date(
                            get_orderInfo.order_date
                          ).getDate()}/${new Date(
                            get_orderInfo.order_date
                          ).getMonth()}/${new Date(
                            get_orderInfo.order_date
                          ).getFullYear()}`} */}
                            {/* {get_orderInfo.order_date} */}
                            <div style={{ width: "100px" }}>
                              {new Date(get_orderInfo.order_date)
                                .getDate()
                                .toString()
                                .padStart(2, "0")}
                              -
                              {(
                                new Date(get_orderInfo.order_date).getMonth() +
                                1
                              )
                                .toString()
                                .padStart(2, "0")}
                              -
                              {new Date(get_orderInfo.order_date).getFullYear()}
                            </div>
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
                        {/* <tr>
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
                        </tr> */}
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
                              padding: "4px",
                              width: "100px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{ width: "150px", wordWrap: "break-word" }}
                            >
                              {get_orderInfo.full_name}
                            </div>
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
                    fontSize: "10px",
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
                              padding: "4px",
                              width: "100px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{ width: "400px", wordWrap: "break-word" }}
                            >
                              {get_orderInfo.special_accessories}
                            </div>
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
                              padding: "4px",
                              width: "100px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{ width: "400px", wordWrap: "break-word" }}
                            >
                              {get_orderInfo.note_msg}
                            </div>
                          </td>
                        </tr>

                        <tr className="price-column">
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
                          >
                            {get_orderInfo.customer_delivery_time
                              ? `${new Date(
                                  get_orderInfo.customer_delivery_time
                                ).getDate()}/${new Date(
                                  get_orderInfo.customer_delivery_time
                                ).getMonth()}/${new Date(
                                  get_orderInfo.customer_delivery_time
                                ).getFullYear()}`
                              : "-"}
                          </td>
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
                        {/* <div
                          style={{
                            width: "150px",
                            height: "150px",
                            // backgroundColor: "black",
                            background: `url('${API_URL}/uploads/${data.imageName}')`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        ></div> */}
                        <img
                          src={`${API_URL}/uploads/${data.imageName}`}
                          alt=""
                          style={{
                            width: "150px",
                            height: "150px",
                          }}
                        />
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

export default All_Notifications;
