import "../Add_Branches/Add_Branches.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { API_URL } from "../../../config";
import $ from "jquery";
import ReactDOM from "react-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../Zula_Category/Zula_Category.css";

const Zula_Style = () => {
  const [get_zula_category, set_zula_category] = useState([]);
  const tableRef = useRef(null);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [get_zula_category_style, set_zula_category_style] = useState([]);

  const handle_get_all_zula_category = async () => {
    try {
      await axios.post(`${API_URL}/get_all_zula_category`).then((res) => {
        if (res.data.success == true) {
          console.log(res.data.data);
          set_zula_category(res.data.data);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handle_get_all_zula_category_style = async () => {
    await axios.post(`${API_URL}/get_zula_category_style`).then((res) => {
      if (res.data.success == true) {
        console.log(res.data.data);
        set_zula_category_style(res.data.data);
      }
    });
  };

  useEffect(() => {
    handle_get_all_zula_category();
    handle_get_all_zula_category_style();
  }, []);

  useEffect(() => {
    if (get_zula_category_style.length > 0 && !tableRef.current) {
      tableRef.current = $("#myTable").DataTable({
        responsive: true,
        data: get_zula_category_style,
        columns: [
          {
            title: "No.",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
          },
          { title: "Zula Category", data: "zula_category" },
          { title: "Style Name", data: "style_name" },
          { title: "Actions", data: null , width : "180px" },
        ],
        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <div style={{ display : "flex" , gap : "12px" }}>
              <button
                className="btn btn-primary w-50"
                onClick={(e) => handle_edit_zula_category_style(data)}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <EditIcon />
              </button>
              <button
                className="btn btn-danger w-50"
                onClick={(e) => {
                  handle_delete_zula_style(e, data._id);
                }}
              >
                <DeleteIcon />
              </button>
            </div>,
            row.cells[row.cells.length - 1] // Render buttons in the last cell
          );
        },
      });
    }
  }, [get_zula_category_style]);
  const [showModal, setShowModal] = useState(false);

  const handle_edit_zula_category_style = (e) => {
    // setData({...data,"min_delivery_time":e.min_delivery_time})
    setData(e);
  };

  const [data, setData] = useState({
    zula_category: "",
    style_name: "",
  });
  const handle_change_input = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/add_zula_category_style`, data).then((res) => {
      if (res.data.success == true) {
        // console.log("okkk");
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
        // window.location = "/zula_category";
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

  // edit zula
  const handle_edit_zula_style = async (e) => {
    e.preventDefault();
    await axios
      .post(`${API_URL}/edit_zula_category_style`, data)
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
          window.location.href = "/zula_style";
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
  };

  const handle_delete_zula_style = async (e, id) => {
    e.preventDefault();
    const ans = window.confirm("Are You Sure...");
    if (ans == true) {
      axios
        .post(`${API_URL}/delete_zula_category_style`, { id: id })
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
            window.location.href = "/zula_style";
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

  return (
    <div>
      <center>
        <h3
          style={{
            fontFamily: "poppins",
            textAlign: "start",
            paddingLeft: "34px",
            marginBottom: "20px",
          }}
        >
          All Zula Style{" "}
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
            // onClick={handleModalToggle}
            // style={{ position: "absolute", left: "3vw" }}
            data-bs-toggle="modal"
            data-bs-target="#addmodel"
          >
            Add Zula Style
          </button>
        </div>

        <div className="show_all_admin_container">
          <div className="table1">
            <table
              id="myTable"
              className="display table table-striped "
              style={{ height: "8vh", width: "100%" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Zula Category</th>
                  <th>Zula Style</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </center>

      {/* Modal */}

      {/* Edit Modal */}

      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      <div
        class="modal fade"
        id="addmodel"
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
                Add New Style
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => handle_submit(e)}>
                {/* <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Zula Category"
                  name="zula_category"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Zula Category"
                  variant="outlined"
                /> */}
                <select
                  name="zula_category"
                  className="form-control custom-margin mb-3"
                  onChange={(e) => handle_change_input(e)}
                >
                  <option disabled selected>
                    --- Select Zula Category ---
                  </option>
                  {get_zula_category.map((data) => {
                    return (
                      <>
                        <option value={data.zula_category}>
                          {data.zula_category}
                        </option>
                      </>
                    );
                  })}
                </select>
                <div>
                  <TextField
                    type="text"
                    className="form-control custom-margin mb-3"
                    placeholder="Style Name"
                    name="style_name"
                    onChange={(e) => handle_change_input(e)}
                    required
                    id="outlined-basic"
                    label="Style Name"
                    variant="outlined"
                  />
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Add Style
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Button trigger modal --> */}
      {/* <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button> */}

      {/* <!-- Edit Modal --> */}
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
                Edit Zula Style
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => handle_edit_zula_style(e)}>
                {/* <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Zula Category"
                  name="zula_category"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Zula Category"
                  variant="outlined"
                  value={data.zula_category}
                /> */}
                <select
                  name="zula_category"
                  className="form-control custom-margin mb-3"
                  onChange={(e) => handle_change_input(e)}
                >
                  <option disabled selected>
                    --- Select Category ---
                  </option>
                  {get_zula_category.map((data1) => {
                    return (
                      <>
                        <option
                          value={data1.zula_category}
                          selected={
                            data.zula_category == data1.zula_category
                              ? true
                              : false
                          }
                        >
                          {data1.zula_category}
                        </option>
                      </>
                    );
                  })}
                </select>
                <div>
                  <TextField
                    type="text"
                    className="form-control custom-margin"
                    placeholder="Style Name"
                    name="style_name"
                    onChange={(e) => handle_change_input(e)}
                    required
                    id="outlined-basic"
                    label="Style Name"
                    variant="outlined"
                    value={data.style_name}
                  />
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Edit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zula_Style;
