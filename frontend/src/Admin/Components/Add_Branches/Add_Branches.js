import "../Add_Branches/Add_Branches.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { API_URL } from "../../../config";
import $ from "jquery";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactDOM from "react-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Loaderrr from "../../../Loader/Loader";

const Add_Branches = () => {
  const [sub_admin_data, set_sub_admin_Data] = useState([]);
  const tableRef = useRef(null);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [get_loader, set_loader] = useState(false);


  const get_user_lead_data = async () => {
    try {
      set_loader(true)

      await axios.post(`${API_URL}/get_all_branches`).then((res) => {
        if (res.data.success == true) {
      set_loader(false)
          set_sub_admin_Data(res.data.data);
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    get_user_lead_data();
  }, []);

  useEffect(() => {
    if (sub_admin_data.length > 0 && !tableRef.current) {
      tableRef.current = $("#myTable").DataTable({
        // responsive: true,
        data: sub_admin_data,
        columns: [
          {
            title: "No.",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
            width: "5px",
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
            title: "Area",
            data: "area",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Priority",
            data: "priority",
            render: (data) => data || "-", // Handle missing data
          },
          { title: "Actions", data: null, width: "10px" },
        ],
        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div style={{ display: "flex" }}>
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
                      onClick={(e) => handle_get_edit_branch(e, data)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    {" "}
                    <button
                      className="btn btn-danger w-100 mb-3"
                      onClick={(e) => {
                        handle_delete_branches(e, data._id);
                      }}
                    >
                      Delete
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
  }, [sub_admin_data]);
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const [data, setData] = useState({
    state: "",
    city: "",
    area: "",
  });

  const handle_get_edit_branch = async (e, data) => {
    e.preventDefault();
    setData(data);
  };

  const handle_delete_branches = async (e, id) => {
    e.preventDefault();
    const ans = window.confirm("Are You Sure...");
    if (ans) {
      await axios
        .post(`${API_URL}/admin_delete_branch`, { id: id })
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
            window.location = "/braches_list";
          } else {
            toast.error(`${res.data.data}`, {
              position: "top-right",
              autoClose: 5000,
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

  const handle_change_input = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handle_submit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/admin_add_new_branch`, data).then((res) => {
      if (res.status == 200) {
        toast.success("Successfully Added...", {
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
        navigate(0);
      } else {
        toast.error("Something Went Wrong", {
          position: "top-right",
          autoClose: 5000,
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
  };

  const handle_edit_branches = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/admin_edit_branch`, data).then((res) => {
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
        window.location = "/braches_list";
      } else {
        toast.error(`${res.data.data}`, {
          position: "top-right",
          autoClose: 5000,
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
  };

  return (
    <div>
          {get_loader ? <Loaderrr /> : null}

      <center>
        <h3
          style={{
            fontFamily: "poppins",
            textAlign: "start",
            paddingLeft: "34px",
            marginBottom: "20px",
          }}
        >
          All Branches{" "}
        </h3>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "start",
            paddingLeft: "34px",
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleModalToggle}
            // style={{ position: "absolute", left: "3vw"  }}
          >
            Add Branches
          </button>
        </div>

        <div className="show_all_admin_container">
          <div className="table1">
            <table
              id="myTable"
              className="display table table-striped "
              style={{ height: "8vh", width: "100%", overflowY: "scroll" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>State</th>
                  <th>City</th>
                  <th>Area</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </center>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="staticBackdrop"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Add New Branches
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleModalToggle}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Modal body content */}
              {/* Replace this with your modal body content */}
              {/* <p>Modal body content...</p> */}
              <form
                onSubmit={(e) => handle_submit(e)}
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <TextField
                  type="text"
                  className="form-control custom-margin"
                  placeholder="State"
                  name="state"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="State"
                  variant="outlined"
                />
                <TextField
                  type="text"
                  className="form-control custom-margin"
                  placeholder="City"
                  name="city"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                />
                <TextField
                  type="text"
                  className="form-control custom-margin"
                  placeholder="Area"
                  name="area"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Area"
                  variant="outlined"
                />
                <TextField
                  type="number"
                  className="form-control custom-margin"
                  placeholder="Priority"
                  name="priority"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Priority"
                  variant="outlined"
                />
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalToggle}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Shop
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" style={{ zIndex: "1000" }}>
          <div class="modal-content">
            <div class="modal-header">
              <h1
                class="modal-title fs-5"
                id="exampleModalLabel"
                style={{ fontFamily: "poppins" }}
              >
                Edit New Branches
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form
                onSubmit={(e) => handle_edit_branches(e)}
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <TextField
                  type="text"
                  className="form-control custom-margin"
                  placeholder="State"
                  name="state"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="State"
                  variant="outlined"
                  value={data.state}
                />
                <TextField
                  type="text"
                  className="form-control custom-margin"
                  placeholder="City"
                  name="city"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="City"
                  variant="outlined"
                  value={data.city}
                />
                <TextField
                  type="text"
                  className="form-control custom-margin"
                  placeholder="Area"
                  name="area"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Area"
                  variant="outlined"
                  value={data.area}
                />
                <TextField
                  type="number"
                  className="form-control custom-margin"
                  placeholder="Priority"
                  name="priority"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Priority"
                  variant="outlined"
                  value={data.priority}
                />
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Edit Shop
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal backdrop */}
    </div>
  );
};

export default Add_Branches;
