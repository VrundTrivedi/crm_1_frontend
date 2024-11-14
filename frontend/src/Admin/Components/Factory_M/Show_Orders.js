import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import $, { data } from "jquery";
import { API_URL } from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import EditIcon from "@mui/icons-material/Edit";
import Cookies from "js-cookie";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import HistoryIcon from "@mui/icons-material/History";
import { useLocation } from "react-router-dom";
import "./Show_Orders.css";
import { DatePicker } from "rsuite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Loaderrr from "../../../Loader/Loader";

const Show_Orders = () => {
  const [subAdminData, setSubAdminData] = useState([]);
  const tableRef = useRef(null);
  const [filterValue, setFilterValue] = useState(""); // State to hold the selected filter value
  const [searchValue, setSearchValue] = useState(""); // State to hold the search input value

  const getSubAdminData = async () => {
    try {
      const response = await axios.post(`${API_URL}/get_shop_m_all_orders`, {
        area: Cookies.get("area"),
        city: Cookies.get("city"),
        role: Cookies.get("role"),
      });
      if (response.data.success === true) {
        console.log(response.data.data);
        setSubAdminData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      window.location.href = "/show_factory_m_orders";
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

  const handleViewPDF = async (data2) => {
    const doc = new jsPDF();
    const images = [];

    try {
      // Personal Information
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Personal Information", 15, 20);
      doc.autoTable({
        startY: 30,
        head: [["Field", "Value"]],
        body: [
          ["Challan No", data2.challan_no],
          [
            "Order Date",
            `${new Date(data2.order_date).getDate()}/${
              new Date(data2.order_date).getMonth() + 1
            }/${new Date(data2.order_date).getFullYear()}`,
          ],
          ["Phone No", data2.ph_no],
          ["Full Name", data2.full_name],
          ["Address", data2.addr],
        ],
      });

      // Zula Information
      doc.text("Zula Information", 15, doc.previousAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 20,
        head: [["Field", "Value"]],
        body: [
          ["Zula Category", data2.zula_category],
          ["Zula Design", data2.zula_style],
          ["Zula Color", data2.zula_color],
          ["Zula Size", data2.zula_size],
          ["Cusion Color", data2.cusion_color],
          ["Cusion Seat Color", data2.cusion_seat_color],
          ["Cusion Back Color", data2.cusion_back_color],
          ["Chain Type", data2.chain_type],
          ["Chain Size (Kada To Floor)", data2.chain_size],
          ["Pillow Color", data2.pillow_color],
          ["Pillow Quantity", data2.pillow_qty],
          ["Pillow Fabric", data2.pillow_fabric],
          ["Pillow Size", data2.pillow_size],
        ],
      });

      // Other Information
      doc.text("Other Information", 15, doc.previousAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.previousAutoTable.finalY + 20,
        head: [["Field", "Value"]],
        body: [
          ["Special Accessories", data2.special_accessories],
          ["Note", data2.note_msg],
          [
            "Customer Delivery Date",
            `${new Date(data2.customer_delivery_time).getDate()}/${
              new Date(data2.customer_delivery_time).getMonth() + 1
            }/${new Date(data2.customer_delivery_time).getFullYear()}`,
          ],
          ["Price", data2.price],
        ],
      });

      // Add a new page for images
      // doc.addPage();

      // Load and add images
      let startY = 260; // Reset startY for new page
      for (const img of data2.images) {
        const image = await loadImage(`${API_URL}/uploads/${img.imageName}`);
        images.push(image);
        const imgWidth = 30; // Adjust width as needed
        const imgHeight = (image.height / image.width) * imgWidth;
        doc.addImage(image, "PNG", 15, startY, imgWidth, imgHeight);
        startY += imgHeight + 10;
      }

      // Convert PDF to blob
      const pdfBlob = doc.output("blob");

      // Create blob URL
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open PDF in a new tab
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Function to load image asynchronously
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.crossOrigin = "Anonymous"; // Allow loading cross-origin images
      image.src = url;
    });
  };
  // const captureContent = async () => {
  //   const content = document.getElementById("myTable1"); // Replace 'myTable1' with the id of the element you want to capture
  //   const priceCells = content.querySelectorAll(".price-column");
  //   priceCells.forEach(cell => {
  //     cell.style.display = "none";
  //   });

  //   const canvas = await html2canvas(content, {
  //     scale: 3, // Increase scale for higher resolution
  //     logging: true, // Enable logging to troubleshoot any issues
  //     scrollY: -window.scrollY, // Correct scroll offset
  //     windowWidth: document.documentElement.offsetWidth, // Use document width
  //     windowHeight: document.documentElement.offsetHeight, // Use document height
  //     allowTaint: true, // Allow images from other domains
  //     useCORS: true, // Enable cross-origin resource sharing
  //   });
  //   return canvas;
  // };

  const captureContent = async () => {
    const content = document.getElementById("myTable1");

    // Hide the price column before capturing the content
    // const priceCells = content.querySelectorAll(".price-column");
    // priceCells.forEach(cell => {
    //   cell.style.display = "none";
    // });
    await $(".price-column").hide();
    await $("#myTable1").css("font-size", "10px");
    await $(".model_img1").css("width", "150px", "height", "200px");
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
    await $("#myTable1").css("font-size", "100%");
    await $(".model_img1").css("width", "150px", "height", "250px");
    // Show the price column again after capturing the content
    // priceCells.forEach(cell => {
    //   cell.style.display = ""; // Reset to default display property
    // });

    return canvas;
  };

  const generatePDF = async () => {
    set_loader(true);

    const canvas = await captureContent();
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("table.pdf");
    set_loader(false);
  };

  const handle_edit_order_status = async (e, data, status) => {
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
          window.location.href = "/show_factory_m_orders";
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

  const [get_status, set_status] = useState([
    { status: "pending" },
    { status: "in-process" },
    { status: "shipping" },
    { status: "deliverd" },
  ]);

  const [get_order_price, set_order_price] = useState([]);
  const [get_updated_order_price, set_updated_order_price] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    };

    if (subAdminData.length > 0 && !tableRef.current) {
      const showValue = getQueryParam("show");

      const filteredData = subAdminData.filter((item) => {
        // Implement your filtering logic here based on the 'show' parameter
        // For example, if 'show' parameter corresponds to 'status' field
        return item.status === showValue;
      });
      tableRef.current = $("#myTable").DataTable({
        // responsive: true,
        stateSave: true, // Enable state saving

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
            width: "50px",
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

              // return formattedDate;
              return `<div style="width : 100px ; text-wrap : no-wrap;">${formattedDate}</div>`;
            },
          },
          {
            title: "City",
            data: "o_city",
            width: "100px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Full Name",
            data: "full_name",
            width: "400px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Phone No",
            data: "ph_no",
            width: "130px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Price",
            data: "price",
            width: "30px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Advance Payment",
            data: "adv_price",
            width: "30px",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Delivery Date",
            data: "customer_delivery_time",
            width: "190px",
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
            title: "Status",
            data: "status",
            width: "140px",
            render: (data) => data || "-", // Handle missing data
          },
          { title: "Actions", data: null, width: "1px" },
          // { title: "Status", data: "status", width: "60px"  },
        ],

        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div>
              <DatePicker
                placeholder="Select Customer Delivery Date"
                className="col-md-12 mb-3"
                name="customer_delivery_time"
                // value={get_updated_customer_date}
                defaultValue={
                  subAdminData[dataIndex].customer_delivery_time
                    ? new Date(subAdminData[dataIndex].customer_delivery_time)
                    : null
                }
                onChange={(date, e, data) =>
                  handle_edit_customer_delivery_date(
                    date,
                    e,
                    subAdminData[dataIndex]
                  )
                }
              />
            </div>,
            row.cells[row.cells.length - 3] // Render buttons in the last cell
          );
          ReactDOM.render(
            <div>
              <select
                onChange={(e) =>
                  handle_edit_order_status(e, data, e.target.value)
                }
                className="form-control custom-margin "
                style={{
                  backgroundColor:
                    data.status === "deliverd" ? "green" : "inherit",
                  color: data.status === "deliverd" ? "white" : "inherit",
                }}
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
            </div>,
            row.cells[row.cells.length - 2] // Render buttons in the last cell
          );
          ReactDOM.render(
            <div style={{ display: "flex", gap: "10px" }}>
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
                      // onClick={(e) => set_orderInfo(subAdminData[dataIndex])}
                      onClick={(e) => set_orderInfo(subAdminData[dataIndex])}
                      data-bs-toggle="modal"
                      data-bs-target="#showImagesModal"
                    >
                      View
                    </button>
                  </li>
                  {/* <li>
                    <button
                      className="btn btn-success w-100 mb-3"
                      // onClick={(e) => set_orderInfo(subAdminData[dataIndex])}
                      onClick={(e) => {set_order_price(subAdminData[dataIndex]);set_updated_order_price(subAdminData[dataIndex].price)}}
                      data-bs-toggle="modal"
                      data-bs-target="#change_price_model"
                    >
                      Edit
                    </button>
                  </li> */}
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
                    <button
                      className="btn btn-primary w-100 mb-3"
                      // onClick={(e) => set_orderInfo(subAdminData[dataIndex])}
                      onClick={(e) => {
                        set_order_price(subAdminData[dataIndex]);
                        set_updated_order_price(subAdminData[dataIndex].price);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#change_price_model"
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    {" "}
                    <button
                      className="btn btn-warning w-100"
                      onClick={(e) => handle_get_history(e, data.order_id)}
                      data-bs-toggle="modal"
                      data-bs-target="#showHistoryModal"
                    >
                      History{" "}
                    </button>
                  </li>
                </ul>
              </div>{" "}
            </div>,
            row.cells[row.cells.length - 1] // Render buttons in the last cell
          );
        },
      });
      if (showValue !== null) {
        tableRef.current.search(showValue).draw();
      }
    }
  }, [subAdminData, searchValue]);

  const handle_edit_customer_delivery_date = async (date, e, data) => {
    e.preventDefault();
    data.update_log += `\n customer_delivery_date :- ${new Date(
      data.customer_delivery_time
    ).toLocaleDateString()} -> ${new Date(date).toLocaleDateString()}`;
    data.customer_delivery_time = date;
    data.msg = `\n customer_delivery_date :- ${new Date(
      data.customer_delivery_time
    ).toLocaleDateString()} -> ${new Date(date).toLocaleDateString()}`;
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

  const [get_updated_customer_date, set_updated_customer_date] = useState();
  const [get_customer_date, set_customer_date] = useState();
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
    const searchParams = new URLSearchParams(location.search);
    const showParam = searchParams.get("show");
    console.log('Value of "show" parameter:', showParam);
    setSearchValue(showParam);
  }, []);

  useEffect(() => {
    // Run this effect only once after the initial render
    const searchParams = new URLSearchParams(location.search);
    const showParam = searchParams.get("show");
    console.log('Value of "show" parameter:', showParam);
    setSearchValue(showParam);
    if (tableRef.current) {
      tableRef.current.search(showParam).draw();
    }
  }, []);

  // If you want to update the search value when searchValue changes,
  // keep the first useEffect as it is.

  const [get_orderInfo, set_orderInfo] = useState([]);

  const handle_edit_price = async (e) => {
    e.preventDefault();
    get_order_price.update_log += `\n Price :- ${
      get_order_price.price
    } -> ${get_updated_order_price} and by ${Cookies.get(
      "admin_username"
    )} on ${new Date().toLocaleString()}`;
    get_order_price.msg = `\n Price :- ${
      get_order_price.price
    } -> ${get_updated_order_price} and by ${Cookies.get(
      "admin_username"
    )} on ${new Date().toLocaleString()}`;
    console.log(get_order_price);
    get_order_price.price = get_updated_order_price;
    get_order_price.customer_delivery_time = get_updated_customer_date;
    await axios
      .post(`${API_URL}/factory_m_edit_order_price`, get_order_price)
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
          window.location.href = "/show_factory_m_orders";
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
  };

  const handle_update_customer_delivery_date = async (date) => {
    // e.preventDefault()
    set_updated_customer_date(date);
    // await axios.post(`${API_URL}/`)
  };

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
        All Factory Orders{" "}
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
        <FormControl
          variant="outlined"
          style={{ marginRight: "10px", width: "10vw" }}
        >
          <InputLabel id="filter-label">Filter By</InputLabel>
          <Select
            labelId="filter-label"
            id="filter-select"
            value={filterValue}
            onChange={(e) => setSearchValue(e.target.value)}
            label="Filter By"
          >
            <MenuItem value={"pending"}>pending</MenuItem>
            <MenuItem value={"in-process"}>in-process</MenuItem>
            <MenuItem value={"shipping"}>shipping</MenuItem>
            <MenuItem value={"deliverd"}>deliverd</MenuItem>
            {/* Add more filter options if needed */}
          </Select>
        </FormControl>
        {/* const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
              return formattedDate; */}
        {/* <DatePicker
          className="datepick"
          popperPlacement="left"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport",
            },
          }}
          onChange={(date) => {
            if (date) {
              const formattedDate = date
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");
              setSearchValue(formattedDate);
            } else {
              setSearchValue(""); // Clear the search value if date is null
            }
          }}
        /> */}
        <div>
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
                tableRef.current.column(8).search(formattedDate).draw(); // Assuming 'customer_delivery_date' is at index 5
              } else {
                setSearchValue("");
                tableRef.current.column(8).search("").draw(); // Clear the search value
              }
            }}
          />
        </div>
      </div>
      <div className="show_all_admin_container">
        <div className="table1">
          <table
            id="myTable"
            className="display table table-striped"
            style={{
              width: "100%",
              //  textWrap: "nowrap"
            }}
          >
            <thead className="thead-dark">
              <tr></tr>
            </thead>
          </table>
        </div>
      </div>

      <div
        class="modal fade"
        id="change_price_model"
        tabindex="-1"
        aria-labelledby="change_price_model"
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
                Change Price Of Order
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => handle_edit_price(e)}>
                <TextField
                  type="number"
                  className="form-control custom-margin mb-3"
                  placeholder="Price"
                  required
                  id="outlined-basic"
                  label="Price"
                  variant="outlined"
                  value={get_updated_order_price}
                  onChange={(e) => set_updated_order_price(e.target.value)}
                />{" "}
                {/* <DatePicker
                  placeholder="Select Customer Delivery Date"
                  className="col-md-12 mb-3"
                  name="customer_delivery_time"
                  // value={get_updated_customer_date}
                  onChange={(date) =>
                    handle_update_customer_delivery_date(date)
                  }
                /> */}
                <button className="btn btn-outline-success">
                  Change Price
                </button>
              </form>
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

                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                            colSpan={2}
                          >
                            Cusion Information:-
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "4px",
                              width: "100px",
                              overflow: "hidden",
                            }}
                            colSpan={2}
                          >
                            <div style={{ whiteSpace: "break-spaces" }}>
                              {get_orderInfo.cusion_info}
                            </div>
                          </td>
                          <td></td>
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
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                            colSpan={2}
                          >
                            Pillow Information:-
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "4px",
                              width: "100px",
                              overflow: "hidden",
                            }}
                            colSpan={2}
                          >
                            <div style={{ whiteSpace: "break-spaces" }}>
                              {get_orderInfo.pillow_info}
                            </div>
                          </td>
                          <td></td>
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
                          className="model_img1"
                          alt=""
                          style={{
                            width: "200px",
                            height: "250px",
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
    </center>
  );
};

export default Show_Orders;
