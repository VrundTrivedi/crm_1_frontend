import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import axios from "axios";
import Cookies from "js-cookie";
import "datatables.net";
import "datatables.net-bs5"; // Import DataTables Bootstrap 5 integration CSS
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css"; // DataTables Bootstrap 5 CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "../Listing/Listing.css";
import Switch from "@mui/material/Switch";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { API_URL } from "../../../config";
import { Link } from "react-router-dom";
import { DatePicker } from "rsuite";
import Loaderrr from "../../../Loader/Loader";

const Listing = () => {
  const [userLeads, setUserLeads] = useState([]);
  const tableRef = useRef(null);
  const [get_loader, set_loader] = useState(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };

  const get_user_lead_data = async () => {
    try {
      set_loader(true)
      const adminDetailsResponse = await axios.post(
        `${API_URL}/get_admin_details`,
        {
          id: Cookies.get("id"),
        }
      );
      if (adminDetailsResponse.status === 200) {
        // console.log(adminDetailsResponse.data)
        const city = adminDetailsResponse.data.city;

        const state = adminDetailsResponse.data.state;
        const role = adminDetailsResponse.data.role;
        const area = adminDetailsResponse.data.area;
        const userLeadsResponse = await axios.post(
          `${API_URL}/get_user_leads`,
          {
            city,
            state,
            role,
            area,
          }
        );
        Cookies.set("city", userLeadsResponse.data[0].c_city);
        set_loader(false)

        setUserLeads(userLeadsResponse.data);
      } else {
        console.log("Problem at Get Admin Details");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    get_user_lead_data();
  }, []);

  useEffect(() => {
    if (userLeads.length > 0 && !tableRef.current) {
      tableRef.current = $("#myTable").DataTable({
        // responsive: true,
        stateSave: true, // Enable state saving

        data: userLeads,
        columns: [
          {
            title: "No.",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
          },
          {
            title: "Order Date",
            data: "createdAt",
            width: "180px",
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
            title: "Name",
            data: "c_name",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "State",
            data: "c_state",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "City",
            data: "c_city",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Area",
            data: "c_area",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Phone",
            data: "c_phno",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Status",
            data: "status",
            width: "150px",
            render: function (data, type, row) {
              if (data === "pending") {
                return '<button class="status-btn btn btn-success btn-toggle w-100" data-toggle="button" aria-pressed="false" autocomplete="off">Pending</button>';
              } else {
                // return '<button class="status-btn btn btn-secondary btn-toggle active" data-toggle="button" aria-pressed="true" autocomplete="off">Completed</button>';
                return "Completed";
              }
            },
          },
        ],
      });
    }
    $("#myTable tbody").on("click", ".status-btn", function () {
      var data = tableRef.current.row($(this).parents("tr")).data();
      updateStatus(data._id, "completed");
    });
  }, [userLeads]);

  const handleSwitchChange = (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    updateStatus(id, newStatus);
  };

  function updateStatus(id, newStatus) {
    console.log(id);

    axios
      .post(`${API_URL}/update_status_of_user_lead`, { id: id })
      .then((res) => {
        if (res.status == 200) {
          window.location.href = "/lead_listing";
        }
      });
  }

  const [filterValue, setFilterValue] = useState(""); // State to hold the selected filter value
  const [searchValue, setSearchValue] = useState(""); // State to hold the search input value

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
  return (
    <center>
          {get_loader ? <Loaderrr /> : null}

      <div
        className="header_txt1 mb-3"
        style={{
          fontSize: "2em",
          marginTop: "2%",
          fontWeight: "500",
          textAlign: "start",
          marginLeft: "2%",
        }}
      >
        Lead Information List
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          paddingLeft: "34px",
        }}
      >
        <DatePicker
          className="datepick"
          popperPlacement="left"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: "viewport",
            },
          }}
          placeholder="Filter By Date"
          style={{ width: "280px" }}
          onChange={(date) => {
            if (date) {
              const formattedDate = date
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");
              setSearchValue(formattedDate);
              tableRef.current.column(1).search(formattedDate).draw(); // Assuming 'customer_delivery_date' is at index 5
            } else {
              setSearchValue("");
              tableRef.current.column(1).search("").draw(); // Clear the search value
            }
          }}
        />
      </div>
      <div
        style={{
          width: "96%",
          marginTop: "2%",
          backgroundColor: "rgb(255, 255, 255)",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div
          className="header_txt2"
          style={{ fontSize: "1.5em", fontWeight: "500" }}
        >
          {Cookies.get("role") == "admin" ? "All Cities" : Cookies.get("city")}
        </div>
        <div className="table1">
          <table
            id="myTable"
            className="display table table-striped"
            style={{ width: "100%", textWrap: "nowrap" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>City</th>
                <th>Address</th>
                <th>Area</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </center>
  );
};

export default Listing;
