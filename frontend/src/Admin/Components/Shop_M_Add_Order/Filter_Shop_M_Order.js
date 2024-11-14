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
import DataTable from "datatables.net-bs5";

const Filter_Show_Shop_M_Order = () => {
  const [subAdminData, setSubAdminData] = useState([]);
  const tableRef = useRef(null);
  const [filterValue, setFilterValue] = useState(""); // State to hold the selected filter value
  const [searchValue, setSearchValue] = useState(""); // State to hold the search input value

  const getSubAdminData = async () => {
    try {
      set_loader(true)

      const response = await axios.post(`${API_URL}/get_shop_m_all_orders`, {
        area: Cookies.get("area"),
        city: Cookies.get("city"),
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

  useEffect(() => {
    getSubAdminData();
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

  const handle_edit_order_status2 = async (e, data, status) => {
    data.status = status;
    console.log("first", data);
    data.update_log += `\nStatus Changed To ${status} On ${new Date().toLocaleDateString()} by ${Cookies.get(
      "admin_username"
    )}`;

    data.msg = `\nStatus Changed To ${status} On ${new Date().toLocaleDateString()} by ${Cookies.get(
      "admin_username"
    )}`;

    e.preventDefault();
    const ans = window.confirm("Are You Sure To Change Status ???");
    if (ans) {
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

  const [get_status, set_status] = useState([
    { status: "pending" },
    { status: "in-process" },
    { status: "shipping" },
    { status: "deliverd" },
  ]);

  const handle_edit_customer_delivery_date = async (date, e, data) => {
    e.preventDefault();
    data.update_log += `\n customer_delivery_date :- ${new Date(
      data.customer_delivery_time
    ).toLocaleDateString()} -> ${new Date(date).toLocaleDateString()}`;
    data.msg = `\n customer_delivery_date :- ${new Date(
      data.customer_delivery_time
    ).toLocaleDateString()} -> ${new Date(date).toLocaleDateString()}`;
    data.customer_delivery_time = date;
    await axios
      .post(`${API_URL}/factory_m_edit_customery_delivery_date`, data)
      .then((res) => {
        if (res.data.success == true) {
          toast.success(`${res.data.data}`);
          // window.location.href = "/show_factory_m_orders"
        } else {
          toast.error(`${res.data.data}`);
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
            render: function (data, type, row, meta) {
              if (data.updated_rec == "false") {
                return `<div>${meta.row + 1}</div>`;
              } else {
                return `<div style="background-color: #ff9833;text-align: center;width: 40px;height: 40px;border-radius: 100%;color: #fff;display: flex;justify-content: center;align-items: center;line-height: 1;" >${
                  meta.row + 1
                }</div>`;
              }
            },
            width: "5px",
          },
          {
            title: "Challan No",
            data: "challan_no",
            width: "10px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Order Date",
            data: "order_date",
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
            title: "Full Name",
            data: "full_name",
            width: "800px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "City",
            data: "o_city",
            width: "50px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Price",
            data: "price",
            width: "50px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Advance Payment",
            data: "adv_price",
            width: "10px",
            render: (data) => data || "-", // Handle missing data
          },
          // { title: "Advance Payment", data: "adv_price" },
          {
            title: "Status",
            data: "status",
            width: "560px",
            render: (data) => data || "-", // Handle missing data
          },

          {
            title: "Customer Delivery Date",
            data: "customer_delivery_time",
            width: "10px",
            render: function (data, type, row) {
              // Format the date as dd-mm-yyyy
              if (!data) {
                return "-";
              }
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
          { title: "Actions", data: null, width: "50px" },
        ],

        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div>
              {Cookies.get("role") == "admin" ? (
                <select
                  onChange={(e) =>
                    handle_edit_order_status2(e, data, e.target.value)
                  }
                  className="form-control custom-margin"
                >
                  {get_status.map((data1, index) => (
                    <option
                      key={index}
                      value={data1.status}
                      selected={data1.status === data.status ? true : false}
                    >
                      {data1.status}
                    </option>
                  ))}
                </select>
              ) : (
                data.status
              )}
            </div>,
            row.cells[row.cells.length - 3] // Render buttons in the last cell
          );

          ReactDOM.render(
            <>
              {/* <button
                className="btn btn-primary w-50"
                onClick={(e) => handle_edit_order(e, data._id)}
              >
                <EditIcon />
              </button> */}
              {/* {Cookies.get("role") == "admin" ? (
                <button
                  className="btn btn-danger w-50"
                  onClick={(e) => handle_edit_order_status(e, data)}
                >
                  <CancelIcon />
                </button>
              ) : null} */}
              {/* <button
                className="btn btn-danger"
                onClick={(e) => {
                  // handle_delete_branches(e, data._id);
                }}
              >
              </button> */}
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
                    <button
                      className="btn btn-success w-100 mb-3"
                      onClick={(e) => set_orderInfo(subAdminData[dataIndex])}
                      data-bs-toggle="modal"
                      data-bs-target="#showImagesModal"
                    >
                      View
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn btn-info w-100 mb-3"
                      onClick={(e) => {
                        generatePDF2(subAdminData[dataIndex]);
                        e.preventDefault(); // Prevent any default behavior, like submitting a form
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#showImagesModal"
                    >
                      Pdf
                    </button>
                  </li>
                  <li>
                    {" "}
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={(e) => handle_edit_order(e, data._id)}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    {" "}
                    {Cookies.get("role") == "admin" ? (
                      <button
                        className="btn btn-danger w-100 mb-3"
                        onClick={(e) => handle_edit_order_status(e, data)}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </li>
                  <li>
                    <button
                      className="btn btn-warning w-100 mb-3"
                      onClick={(e) => handle_get_history(e, data.order_id)}
                      data-bs-toggle="modal"
                      data-bs-target="#showHistoryModal"
                    >
                      Hsitory
                    </button>
                  </li>
                </ul>
              </div>{" "}
            </>,
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
      data.msg = `\nGo To Archive On ${new Date().toLocaleDateString()}`;
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

  // const [get_orderInfo, set_orderInfo] = useState([]);
  // const [ get_filter_choice , set_filter_choice ] = useState("order_date")

  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     const startDateISO = startDate.toISOString().split("T")[0];
  //     const endDateISO = endDate.toISOString().split("T")[0];
  //     var choice = get_filter_choice

  //     console.log("choice==========",choice)

  //     const filteredData = subAdminData.filter((item) => {
  //       const orderDate = item[choice];
  //       console.log("ordeeee======",orderDate)
  //       if (orderDate) {
  //         const orderDateISO = orderDate.split("T")[0];
  //         return orderDateISO >= startDateISO && orderDateISO <= endDateISO;
  //       }
  //       return false;
  //     });

  //     setSubAdminData(filteredData);

  //     if (tableRef.current) {
  //       tableRef.current.clear().rows.add(filteredData).draw();
  //     }
  //   }
  // }, [startDate, endDate , get_filter_choice ]);

  // const [delivery_startDate, delivery_setStartDate] = useState(null);
  // const [delivery_endDate, delivery_setEndDate] = useState(null);

  const [get_orderInfo, set_orderInfo] = useState([]);
  const [get_filter_choice, set_filter_choice] = useState("order_date"); // Default option

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      const startDateISO = startDate.toISOString().split("T")[0];
      const endDateISO = endDate.toISOString().split("T")[0];
      const choice = get_filter_choice;

      const filteredData = subAdminData.filter((item) => {
        const orderDate = item[choice];
        if (orderDate) {
          const orderDateISO = orderDate.split("T")[0];
          return orderDateISO >= startDateISO && orderDateISO <= endDateISO;
        }
        return false;
      });

      set_orderInfo(filteredData);

      if (tableRef.current) {
        tableRef.current.clear().rows.add(filteredData).draw();
      }
    }
  }, [startDate, endDate, get_filter_choice, subAdminData]);

  //   useEffect(() => {
  //     if (delivery_startDate && delivery_endDate) {
  //       const startDateISO = delivery_startDate.toISOString().split("T")[0];
  //       const endDateISO = delivery_endDate.toISOString().split("T")[0];
  //         console.log("===========================",startDateISO)
  //       const filteredData = subAdminData.filter((item) => {
  //         const orderDate = item.customer_delivery_time;
  //         if (orderDate) {
  //           const orderDateISO = orderDate.split("T")[0];
  //           return orderDateISO >= startDateISO && orderDateISO <= endDateISO;
  //         }
  //         return false;
  //       });

  //       setSubAdminData(filteredData);

  //       if (tableRef.current) {
  //         tableRef.current.clear().rows.add(filteredData).draw();
  //       }
  //     }
  //   }, [delivery_startDate, delivery_endDate]);

  //   useEffect(() => {
  //     if (delivery_startDate && delivery_endDate) {
  //         const startDateISO = delivery_startDate.toISOString().split("T")[0];
  //         const endDateISO = delivery_endDate.toISOString().split("T")[0];

  //         const filteredData = subAdminData.filter((item) => {
  //             const orderDate = item.customer_delivery_time;
  //             if (orderDate) {
  //                 const orderDateISO = orderDate.split("T")[0];
  //                 return orderDateISO >= startDateISO && orderDateISO <= endDateISO;
  //             }
  //             return false; // Exclude items with invalid order_date dates
  //         });

  //         // Log filteredData to ensure it contains the correct records
  //         console.log("Filtered Data:", filteredData);

  //         // Autofill DataTable with filtered data
  //         if (tableRef.current) {
  //             // Clone filteredData to avoid modifying original records
  //             const clonedData = filteredData.map(item => ({ ...item }));
  //             // Clear existing rows before adding new ones
  //             tableRef.current.clear().rows.add(clonedData).draw();
  //         }
  //     }
  // }, [delivery_startDate, delivery_endDate, subAdminData, tableRef]);

  // console.log(filteredData)

  // Update the subAdminData state with the filtered data
  // setSubAdminData(filteredData);

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
      <div
        style={{
          textAlign: "start",
          marginLeft: "50px",
          display: "flex",
          gap: "10px",
        }}
      >
        {" "}
        <select
          onChange={(e) => {
            set_filter_choice(e.target.value);
          }}
          style={{
            width: "180px",
            height: "51px",
            borderRadius: "5px",
            borderColor: "transparent",
          }}
        >
          <option value="order_date">Order Date</option>
          <option value="customer_delivery_time">Customer Delivery Date</option>
        </select>
        <DatePicker
          onChange={(date) => setStartDate(date)}
          value={startDate}
          placeholder="Order Start Date"
        />
        <DatePicker
          onChange={(date) => setEndDate(date)}
          value={endDate}
          placeholder="Order End Date"
        />
        {/* <DatePicker
          onChange={(date) => delivery_setStartDate(date)}
          value={delivery_startDate}
          placeholder="Delivery Start Date"
        />
        <DatePicker
          onChange={(date) => delivery_setEndDate(date)}
          value={delivery_endDate}
          placeholder="Delivery End Date"
        /> */}
      </div>
      <div className="show_all_admin_container">
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
                            {new Date(get_orderInfo.customer_delivery_time)
                              .getDate()
                              .toString()
                              .padStart(2, "0")}
                            -
                            {(
                              new Date(
                                get_orderInfo.customer_delivery_time
                              ).getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}
                            -
                            {new Date(
                              get_orderInfo.customer_delivery_time
                            ).getFullYear()}
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

export default Filter_Show_Shop_M_Order;
