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
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Loaderrr from "../../../Loader/Loader";

const Show_Sub_Admin_List = () => {
  const [subAdminData, setSubAdminData] = useState([]);
  const tableRef = useRef(null);
  const [filterValue, setFilterValue] = useState(""); // State to hold the selected filter value
  const [searchValue, setSearchValue] = useState(""); // State to hold the search input value
  const [get_loader, set_loader] = useState(false);


  const getSubAdminData = async () => {
    try {
      set_loader(true)
      const response = await axios.post(`${API_URL}/get_all_sub_admin_data`);

      if (response.status === 200) {
      set_loader(false)
        setSubAdminData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getSubAdminData();
  }, []);

  useEffect(() => {
    if (subAdminData.length > 0 && !tableRef.current) {
      const filteredData = subAdminData.filter(
        (item) => item.username !== "webmaster"
      );
      tableRef.current = $("#myTable").DataTable({
        // responsive: true,
        data: filteredData,
        columns: [
          {
            title: "No.",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
          },
          {
            title: "Name",
            data: "name",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Username",
            data: "username",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Password",
            data: "password",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Email",
            data: "email",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Phone",
            data: "ph_no",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "State",
            data: "state",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "City",
            data: "city",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Role",
            data: "role",
            render: (data) => data || "-", // Handle missing data
          },
          { title: "Actions", data: null, width: "10px" },
        ],
        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div style={{ display: "flex", gap: "12px" }}>
              {data.role == "admin" ? "Admin" : null}
              {data.role == "shop_m" ? "Shop Manager" : null}
              {data.role == "factory_m" ? "Factory Manager" : null}
            </div>,
            row.cells[row.cells.length - 2] // Render buttons in the last cell
          );

          ReactDOM.render(
            <div style={{ display: "flex", gap: "12px" }}>
              {/* <button
                className="btn btn-primary w-50"
                onClick={(e) => handle_get_sub_admin_info_for_edit(e,data._id)}
                
              >
                <EditIcon/>
              </button> */}
              {/* {data.role !== "admin" ?  <button
                className="btn btn-danger w-50"
                onClick={(e) => handle_delete_sub_admin(e,data._id)}
              >
                <DeleteIcon/>
              </button> : "Can't Delete"} */}
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
                  style={{ padding: "10px" }}
                >
                  <li>
                    {" "}
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={(e) =>
                        handle_get_sub_admin_info_for_edit(e, data._id)
                      }
                    >
                      Edit{" "}
                    </button>
                  </li>
                  <li>
                    {data.role !== "admin" ? (
                      <button
                        className="btn btn-danger w-100 mb-3"
                        onClick={(e) => handle_delete_sub_admin(e, data._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      "Can't Delete"
                    )}
                  </li>
                </ul>
              </div>{" "}
            </div>,
            row.cells[row.cells.length - 1] // Render buttons in the last cell
          );
        },
      });
    }
  }, [subAdminData]);

  const handle_delete_sub_admin = async (e, id) => {
    e.preventDefault();
    const ans = window.confirm("Are You Sure ???");
    if (ans) {
      await axios
        .post(`${API_URL}/delete_sub_admin_data`, { id: id })
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
              // transition: Bounce,
            });
            window.location.href = "/show_sub_admin_list";
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
              // transition: Bounce,
            });
          }
        });
    }
  };

  const handle_get_sub_admin_info_for_edit = async (e, id) => {
    Cookies.set("id_edit_sub_admin_info", id);
    window.location.href = "/edit_sub_admin";
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
        All Sub Admins{" "}
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
        <Link
          to="/add_sub_admin"
          style={{ height: "38px" }}
          className="btn btn-primary"
        >
          Add New User
        </Link>
        <FormControl variant="outlined" style={{ width: "10vw" }}>
          <InputLabel id="filter-label">Filter By</InputLabel>
          <Select
            labelId="filter-label"
            id="filter-select"
            value={filterValue}
            onChange={(e) => setSearchValue(e.target.value)}
            label="Filter By"
          >
            <MenuItem value={"admin"}>admin</MenuItem>
            <MenuItem value={"shop_m"}>shop_m</MenuItem>
            <MenuItem value={"factory_m"}>factory_m</MenuItem>
            {/* Add more filter options if needed */}
          </Select>
        </FormControl>
      </div>

      <div className="show_all_admin_container">
        <div style={{ marginBottom: "10px" }}>
          {/* Dropdown to select filter criteria */}

          {/* Search input field */}
        </div>
        <div className="table1">
          <table
            id="myTable"
            className="display table table-striped"
            style={{ width: "100%" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>City</th>
                <th>Address</th>
                <th>Area</th>
                <th>Phone</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </center>
  );
};

export default Show_Sub_Admin_List;
