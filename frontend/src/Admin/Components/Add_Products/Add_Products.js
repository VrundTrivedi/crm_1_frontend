import "../Add_Branches/Add_Branches.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "react-router-dom";
import Cookies from "js-cookie";
import { TextField, Tooltip } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { API_URL } from "../../../config";
import $ from "jquery";
import ReactDOM from "react-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { RequestPageTwoTone } from "@mui/icons-material";
import "../Add_Products/Add_Product.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Loaderrr from "../../../Loader/Loader";

function Add_Product() {
  const [file, setFile] = useState(null);
  const [get_loader, set_loader] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/add_new_product`, formData);
    } catch (error) {}
  };

  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    cat_no: "",
  });
  const handle_change_input = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const imageRef = useRef();

  const handle_submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("style_name", data.style_name);
    formData.append("color_name", data.color_name);
    formData.append("file", data.file);
    formData.append("cat_no", data.cat_no);

    await axios.post(`${API_URL}/add_new_product`, formData).then((res) => {
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

  const handle_edit_product = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/edit_product`, data).then((res) => {
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
        window.location.href = "/add_products";
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

  const [get_all_product_info, set_all_product_info] = useState([]);

  const handle_get_all_products = async () => {
    set_loader(true);

    await axios.post(`${API_URL}/get_all_products`).then((res) => {
      set_loader(false);
      set_all_product_info(res.data.data);
    });
  };

  const [get_category, set_category] = useState([]);

  const handle_get_all_zula_category = async () => {
    try {
      await axios.post(`${API_URL}/get_all_zula_category`).then((res) => {
        if (res.data.success == true) {
          set_category(res.data.data);
        }
      });
    } catch (error) {}
  };

  const [get_zula_category_style, set_zula_category_style] = useState([]);

  const handle_get_all_zula_category_style = async (style_name) => {
    await axios
      .post(`${API_URL}/get_zula_style_for_color`, {
        zula_category: style_name,
      })
      .then((res) => {
        if (res.data.success == true) {
          set_zula_category_style(res.data.data);
        }
      });
  };

  const [get_style_color, set_style_color] = useState([]);

  const handle_color_of_given_style = async (e, style_name) => {
    e.preventDefault();
    await axios
      .post(`${API_URL}/get_zula_color_of_given_style`, {
        zula_category: data.category,
        style_name: style_name,
      })
      .then((res) => {
        if (res.data.success == true) {
          set_style_color(res.data.data);
        }
      });
  };

  useEffect(() => {
    handle_get_all_products();
    // handle_get_all_zula_category();
    // handle_get_all_zula_category_style();
  }, []);
  const tableRef = useRef(null);
  const label = { inputProps: { "aria-label": "Switch demo" } };

  useEffect(() => {
    if (get_all_product_info.length > 0 && !tableRef.current) {
      tableRef.current = $("#myTable").DataTable({
        // responsive: true,
        data: get_all_product_info,
        columns: [
          {
            title: "No.",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
            width: "5px",
          },

          {
            title: "Title",
            data: "title",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Description",
            data: "description",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Image",
            data: null, // Handle missing data
          },
          {
            title: "Category",
            data: "category",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Style",
            data: "style_name",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Color",
            data: "color_name",
            render: (data) => data || "-", // Handle missing data
          },
          {
            title: "Catelog No.",
            data: "cat_no",
            render: (data) => data || "-", // Handle missing data
          },
          { title: "Actions", data: null, width: "10px" },
        ],

        createdRow: function (row, data, dataIndex) {
          ReactDOM.render(
            <>
              <img src={`${API_URL}${data.prodImage}`} alt="" width={110} />
            </>, // Render empty content for image, as it's rendered separately
            row.cells[row.cells.length - 6] // Render in the third last cell (image column)
          );
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
                      onClick={(e) => handle_get_product_info_for_edit(data)}
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
                        handle_delete_product(e, data._id);
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
  }, [get_all_product_info]);

  const handle_get_product_info_for_edit = async (product_data) => {
    setData(product_data);
  };

  const handle_edit_product_image = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", imageRef.current.files[0]);
    formData.append("_id", data._id);

    await axios.post(`${API_URL}/edit_product_image`, formData).then((res) => {
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
        window.location.href = "/add_products";
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

  const handle_delete_product = async (e, id) => {
    const ans = window.confirm("Are You Sure...");
    if (ans) {
      axios.post(`${API_URL}/delete_product`, { id: id }).then((res) => {
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
          window.location.href = "/add_products";
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
          All Product{" "}
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
            // style={{ position: "absolute",  left: "3vw" }}
            data-bs-toggle="modal"
            data-bs-target="#addmodel"
          >
            Add New Product
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
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Catelog No.</th>
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
                Add New Product
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
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Title"
                  name="title"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                />
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Description"
                  name="description"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  inputProps={{ min: "0" }}
                />
                <input
                  type="file"
                  className="form-control custom-margin mb-3"
                  placeholder="Image"
                  name="file"
                  onChange={(e) => {
                    const file = e.target.files[0]; // Get the file from the event object
                    setData({ ...data, file }); // Update formData state
                  }}
                  required
                  id="outlined-basic"
                  label="Image"
                  variant="outlined"
                  aria-label="Upload Image"
                />
                {/* <select
                  name="category"
                  className="form-control custom-margin mb-3"
                  onChange={(e) => handle_change_input(e)}
                >
                  <option disabled selected>
                    --- Select Category ---
                  </option>
                  {get_category.map((data) => {
                    return (
                      <>
                        <option value={data.zula_category}>
                          {data.zula_category}
                        </option>
                      </>
                    );
                  })}
                </select> */}
                {/* <select
                  name="category"
                  className="form-control custom-margin mb-3"
                  // onChange={(e) => handle_change_input(e)}
                  onChange={(e) => {
                    handle_change_input(e);
                    handle_get_all_zula_category_style(e.target.value);
                  }}
                >
                  <option disabled selected>
                    --- Select Category ---
                  </option>
                  {get_category.map((data) => {
                    return (
                      <>
                        <option value={data.zula_category}>
                          {data.zula_category}
                        </option>
                      </>
                    );
                  })}
                </select> */}
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Category"
                  name="category"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Category"
                  variant="outlined"
                />
                {/* <select
                  name="style_name"
                  className="form-control custom-margin mb-3"
                  onChange={(e) => {
                    handle_change_input(e);
                    handle_color_of_given_style(e, e.target.value);
                  }}
                >
                  <option disabled selected>
                    --- Select Zula Category Style ---
                  </option>
                  {get_zula_category_style.map((data) => {
                    return (
                      <>
                        <option value={data.style_name}>
                          {data.style_name}
                        </option>
                      </>
                    );
                  })}
                </select> */}
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Style"
                  name="style_name"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Style"
                  variant="outlined"
                />
                {/* <select
                  name="color_name"
                  className="form-control custom-margin mb-3"
                  onChange={(e) => handle_change_input(e)}
                >
                  <option disabled selected>
                    --- Select Zula Category Style ---
                  </option>
                  {get_style_color.map((data) => {
                    return (
                      <>
                        <option value={data.color_name} >
                          {data.color_name}
                       </option>
                      </>
                    );
                  })}
                </select> */}
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Color"
                  name="color_name"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Color"
                  variant="outlined"
                />{" "}
                <div className="color_for_product ">
                  {/* {get_style_color.map((data) => {
                    return (
                      <button
                        className="btn"
                        type="button"
                        value={data.color_name}
                        name="color_name"
                        onClick={(e) => handle_change_input(e)}
                        style={{
                          backgroundColor: `${data.color_name}`,
                          width: "30px",
                          height: "30px",
                          borderRadius: "180%",
                        }}
                      ></button>
                    );
                  })} */}
                </div>
                {/* <div className="color_for_product mb-3">
                  {get_style_color.map((data, index) => (
                    <label key={index} style={{ marginRight: "10px" }}>
                      <input
                        type="radio"
                        name="color"
                        value={data.color_name}
                        style={{ display: "none" }}
                        // onChange={(e) => handleColorChange(e.target.value)} // handleColorChange is a function to handle color selection
                      />
                      <div
                        style={{
                          backgroundColor: `${data.color_name}`,
                          width: "30px",
                          height: "30px",
                          borderRadius: "180%",
                          border: "1px solid #ccc",
                          display: "inline-block",
                          cursor: "pointer",
                        }}
                      ></div>
                    </label>
                  ))}
                </div> */}
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Catelog No."
                  name="cat_no"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Catelog No."
                  variant="outlined"
                />
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
                Edit Product
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
                onSubmit={(e) => handle_edit_product(e)}
                enctype="multipart/form-data"
              >
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Title"
                  name="title"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  value={data.title}
                />
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Description"
                  name="description"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  inputProps={{ min: "0" }}
                  value={data.description}
                />
                <div className="row">
                  <div className="col-md-8">
                    <input
                      type="file"
                      className="form-control custom-margin mb-3"
                      placeholder="Image"
                      name="file"
                      // onChange={(e) => {
                      //   const file = e.target.files[0]; // Get the file from the event object
                      //   setData({ ...data, file }); // Update formData state
                      // }}
                      ref={imageRef}
                      id="outlined-basic"
                      label="Image"
                      variant="outlined"
                      aria-label="Upload Image"
                    />
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(e) => handle_edit_product_image(e)}
                    >
                      Edit Image
                    </button>
                  </div>
                </div>
                {/* <select
                  name="category"
                  className="form-control custom-margin mb-3"
                  onChange={(e) => {
                    handle_change_input(e);
                    handle_get_all_zula_category_style(e.target.value);
                  }}
                >
                  <option disabled selected>
                    --- Select Category ---
                  </option>
                  {get_category.map((data1) => {
                    return (
                      <>
                        <option
                          value={data1.zula_category}
                          selected={
                            data.category == data1.zula_category ? true : false
                          }
                        >
                          {data1.zula_category}
                        </option>
                      </>
                    );
                  })}
                </select> */}

                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Category"
                  name="category"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Category"
                  variant="outlined"
                  inputProps={{ min: "0" }}
                  value={data.category}
                />
                {/* <select
                  name="style_name"
                  className="form-control custom-margin mb-3"
                  onClick={(e) => {
                    handle_get_all_zula_category_style(data.category);
                    handle_color_of_given_style(e, e.target.value);
                  }}
                  onChange={(e) => {
                    handle_change_input(e);
                  }}
                >
                  <option disabled selected>
                    --- Select Style ---
                  </option>
                  {get_zula_category_style.map((data1) => {
                    return (
                      <>
                        <option
                          value={data1.style_name}
                          selected={
                            data.style_name == data1.style_name ? true : false
                          }
                        >
                          {data1.style_name}
                        </option>
                      </>
                    );
                  })}
                </select> */}
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Style"
                  name="style_name"
                  onChange={(e) => handle_change_input(e)}
                  id="outlined-basic"
                  label="Style"
                  variant="outlined"
                  inputProps={{ min: "0" }}
                  value={data.style_name}
                />
                <div
                  className="row mb-3"
                  style={{ width: "100%", marginLeft: "3px" }}
                >
                  {" "}
                  {/* <select
                    name="color_name"
                    className="form-control custom-margin mb-3"
                    onChange={(e) => {
                      handle_change_input(e);
                    }}
                  >
                    <option disabled selected>
                      --- Select Style ---
                    </option>
                    {get_style_color.map((data1) => {
                      return (
                        <>
                          <option
                            value={data1.color_name}
                            selected={
                              data.color_name == data1.color_name ? true : false
                            }
                          >
                            {data1.color_name}
                          </option>
                        </>
                      );
                    })}
                  </select> */}
                  <TextField
                    type="text"
                    className="form-control custom-margin mb-3"
                    placeholder="Color"
                    name="color_name"
                    onChange={(e) => handle_change_input(e)}
                    id="outlined-basic"
                    label="Color"
                    variant="outlined"
                    inputProps={{ min: "0" }}
                    value={data.color_name}
                  />
                </div>
                <TextField
                  type="text"
                  className="form-control custom-margin mb-3"
                  placeholder="Catelog No."
                  name="cat_no"
                  onChange={(e) => handle_change_input(e)}
                  required
                  id="outlined-basic"
                  label="Catelog No."
                  variant="outlined"
                  value={data.cat_no}
                />
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" class="btn btn-primary">
                    Edit Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add_Product;
