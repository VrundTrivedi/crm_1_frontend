import { TextField, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../Add_Sub_Admin/Add_Sub_Admin.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { API_URL } from "../../../config";
import $ from "jquery";
import { DatePicker } from "rsuite";
import "rsuite/Button/styles/index.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import EditIcon from "@mui/icons-material/Edit";

const Shop_M_Edit_Order = () => {


  const [sections, setSections] = useState([
    {
      challan_no: "",
      order_date: "",
      full_name: "",
      ph_no: "",
      addr: "",
      zula_category: "",
      zula_style: "",
      zula_color: "",
      pillow_info: "",
      cusion_info: "",
      zula_size: "",
      chain_type: "",
      chain_size: "",
      special_accessories: "",
      note_msg: "",
      remarks : "",
      price: "",
      adv_price: "",
      pending_price: "",
      customer_delivery_time: "",
      status: "",
      images: [],
      o_state: Cookies.get("state"),
      o_city: Cookies.get("city"),
      o_area: Cookies.get("area"),
      update_log: "",
    },
  ]);
  const navigate = useNavigate()

  // const handleFileChange = (index, e) => {
  //   const files = Array.from(e.target.files);
  //   const updatedSections = [...sections];
  //   updatedSections[index].images = files;
  //   setSections(updatedSections);
  // };
  const handleFileChange = (index, e) => {
    const { files } = e.target;
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      images: [...updatedSections[index].images, ...files],
    };
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([...sections, {}]);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    if (name == "adv_price") {
      updatedSections[index].pending_price =
        updatedSections[index].price - value;
    }
    if (name == "price") {
      updatedSections[index].pending_price =
        value - updatedSections[index].adv_price;
    }
    updatedSections[index] = { ...updatedSections[index], [name]: value };
    setSections(updatedSections);
  };

  const handle_get_customer_delivery_date = (index, date) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      customer_delivery_time: date,
    };
    setSections(updatedSections);
  };
  const handle_get_order_date = (index, date) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      order_date: date,
    };
    setSections(updatedSections);
  };

  const handleEditOrder = async (e) => {
    e.preventDefault();
    sections[0].role = Cookies.get("role")
    console.log("===============", sections[0]);

    logEditedFields(get_prev_order[0], sections[0]);
    var logg1;
    function logEditedFields(previousRecord, currentRecord) {
      if (logg1 == undefined) {
        logg1 = "";
      }
      for (const key in currentRecord) {
        if (currentRecord.hasOwnProperty(key)) {
          if (currentRecord[key] !== previousRecord[key]) {
            logg1 += `\n${key} :- ${previousRecord[key]} -> ${currentRecord[key]} `;
            // console.log(`"${key}" :- ${previousRecord[key]} -> ${currentRecord[key]} by ${Cookies.get('admin_name')} from ${Cookies.get('area')} area branch on ${new Date().toLocaleDateString()}`);
            // console.log(`Previous value: ${previousRecord[key]}`);
            // console.log(`Current value: ${currentRecord[key]}`);
          }
        }
      }
      if (logg1) {
        logg1 += `by ${Cookies.get("admin_name")} from ${Cookies.get(
          "area"
        )} area branch on ${new Date().toLocaleDateString()}`;
      }
      console.log(logg1);
      // setSections({ ...sections[0], update_log: logg1 });
      sections[0].update_log += logg1;
      sections[0].msg = logg1;
    }
    await axios
      .post(`${API_URL}/edit_shop_m_order_info`, sections[0])
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
          navigate('/get_shop_m_all_orders')
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

  const [data, setData] = useState({ color_name: "", chain_type: "" });
  const same_ph_noRef = useRef(); // use for checkbox
  const c_wh_no1 = useRef(); //use for fill text box
  const [get_zula_category, set_zula_category] = useState([]);
  const [get_default_delivery_time, set_default_delivery_time] = useState({
    min_delivery_time: "",
    max_delivery_time: "",
  });

  useEffect(() => {}, []);

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

  const [get_zula_category_style, set_zula_category_style] = useState([]);

  const handle_get_all_zula_category_style = async (style_name) => {
    await axios
      .post(`${API_URL}/get_zula_style_for_color`, {
        zula_category: style_name,
      })
      .then((res) => {
        if (res.data.success == true) {
          console.log(res.data.data);
          set_zula_category_style(res.data.data);
        }
      });
  };

  const [get_style_color, set_style_color] = useState([]);

  const handle_color_of_given_style = async (e, style_name, index) => {
    e.preventDefault();
    await axios
      .post(`${API_URL}/get_zula_color_of_given_style`, {
        zula_category: sections[index].zula_category,
        style_name: style_name,
      })
      .then((res) => {
        if (res.data.success == true) {
          console.log(res.data.data);
          set_style_color(res.data.data);
        }
      });
  };

  const [get_chain_type, set_chain_type] = useState([]);
  const handle_get_chain_types = async () => {
    try {
      await axios.post(`${API_URL}/show_all_chain_types`).then((res) => {
        if (res.data.success == true) {
          set_chain_type(res.data.data);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handle_get_all_zula_category();
    handle_get_chain_types();
  }, []);

  const [get_areas, set_areas] = useState([]);

  const handle_get_areas = async (e) => {
    console.log(data.c_city);
    console.log(data.c_state);
    await axios
      .post(`${API_URL}/get_areas`, { city: e.target.value, state: data.state })
      .then((res) => {
        console.log(res.data);
        set_areas(res.data);
      });
  };
  const [get_states, set_states] = useState([]);

  const handle_get_states = async () => {
    try {
      await axios.post(`${API_URL}/get_states`).then((res) => {
        if (res.data.success == true) {
          console.log(res.data.data);
          set_states(res.data.data);
        }
      });
    } catch (error) {
      console.log("============= At Get State Controller ==========\n", error);
    }
  };

  const [get_cities, set_cities] = useState([]);

  const handle_get_cities = async (e) => {
    try {
      await axios
        .post(`${API_URL}/get_cities`, { state: e.target.value })
        .then((res) => {
          if (res.data.success == true) {
            console.log(res.data.data);
            set_cities(res.data.data);
          }
        });
    } catch (error) {
      console.log("============= At Get State Controller ==========\n", error);
    }
  };

  const handle_get_default_delivery_time = async (e, zula_category) => {
    e.preventDefault();
    await axios
      .post(`${API_URL}/get_default_delivery_time_of_category`, {
        zula_category: zula_category,
      })
      .then((res) => {
        if (res.data.success == true) {
          // console.log(res.data.data[0]);
          set_default_delivery_time(res.data.data[0]);
        }
      });
  };
  const [get_prev_order, set_prev_order] = useState([]);
  let order_date2;
  const handle_get_order_info_for_edit = async () => {
    await axios
      .post(`${API_URL}/get_order_info_for_edit_order`, {
        id: Cookies.get("id_for_edit_order"),
      })
      .then(async (res) => {
        if (res.data.success == true) {
          console.log(res.data.data);
          const dateString = res.data.data[0].order_date;
          const dateObject = new Date(dateString).toString();
          const dateString_customer = res.data.data[0].order_date;
          const dateObject_customer_delivery_date = new Date(
            dateString_customer
          ).toString();
          // set_order_info_for_edit(res.data.data)
          // Cookies.set("order_date",dateObject)
          // console.log("==ssssssssssssss===",dateObject_customer_delivery_date)
          // Cookies.set("order_date",res.data.data[0].customer_delivery_time)
          Cookies.set("order_date", res.data.data[0].order_date);
          Cookies.set(
            "customer_delivery_date",
            res.data.data[0].customer_delivery_time
          );

          // order_date2 = res.data.data[0].customer_delivery_time.toString()

          console.log("eeeeeeeeeeeeeeeeeeeeeee", order_date2);
          set_prev_order(res.data.data);
          await setSections(res.data.data);
          // sections[0].order_date = dateObject
          // setSections([...sections,sections])
          // console.log(dateString)
          // const parsedDate = new Date(dateString);
          // console.log(parsedDate);
          // sections[0].customer_delivery_time = parsedDate
          // setSections([...sections]);
          console.log(dateString);
          setSelectedDate({ order_date: dateObject });
          console.log("==============", selectedDate);
          // setSelectedDate(dateObject);
        }
      });
  };
  useEffect(() => {
    handle_get_states();
    handle_get_order_info_for_edit();
    window.scrollTo(0, 0);
  }, []);
  // console.log("=========",sections[0].order_date)
  const [selectedDate, setSelectedDate] = useState({});
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Handle any additional logic here
  };
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEditButtonClick = (e, data) => {
    e.preventDefault();
    setSelectedImage(data);
  };

  const handleFileChange1 = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handle_edit_imageRef = useRef();

  const handleEditSingleImage = async () => {
    try {
      console.log("===--scf -sdo 0- ", selectedImage);
      const formData = new FormData();
      formData.append("orderId", sections[0].order_id);
      formData.append("_id", sections[0]._id);
      formData.append("imageId", selectedImage._id);
      formData.append("imageName", handle_edit_imageRef.current.files[0]);
      formData.append("prevImage", selectedImage.imageName);
      formData.append("imageData", selectedFile); // Append the selected file to the form data

      await axios
        .post(`${API_URL}/edit_order_single_image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.success == true) {
            window.location.href = "/shop_m_edit_order";
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

      setInputValue("");
      setSelectedFile(null); // Clear selected file after submission
    } catch (error) {
      console.error("Error editing image:", error);
    }
  };

  const handleAddImages = () => {
    const fileInput = document.getElementById("file-input");
    const files = fileInput.files;

    const formData = new FormData();

    formData.append("_id", sections[0]._id);
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    axios
      .post(`${API_URL}/add_images_in_existing_order`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        // Handle response from the server
        window.location.href = "/shop_m_edit_order";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <center>
        <form onSubmit={handleEditOrder}>
          <div
            style={{
              fontFamily: "poppins",
              fontSize: "2em",
            }}
            className="mb-1"
          >
            Update Order
          </div>

          <div
            className="row"
            style={{
              width: "90%",
              padding: "20px",
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          >
            <p
              style={{
                fontSize: "1em",
                fontWeight: "500",
                textAlign: "start",
              }}
            >
              Personal Infomrmation:-
            </p>
            <div className="col-md-3 mb-3">
              <TextField
                type="text"
                className="form-control custom-margin"
                placeholder="Challan No."
                name="challan_no"
                value={sections[0].challan_no}
                onChange={(e) => handleChange(0, e)}
                required
                tabIndex="0"
                id="outlined-basic"
                label="Challan No."
                variant="outlined"
              />
            </div>
            <div className="col-md-3 mb-3">
              <TextField
                type="text"
                className="form-control custom-margin"
                placeholder="Full Name"
                name="full_name"
                value={sections[0].full_name}
                onChange={(e) => handleChange(0, e)}
                required
                tabIndex="0"
                id="outlined-basic"
                label="Full Name"
                variant="outlined"
              />
            </div>
            <div class="col-md-3 mb-3">
              <TextField
                type="tel"
                className="form-control custom-margin"
                placeholder="Phone No"
                name="ph_no"
                value={sections[0].ph_no}
                onChange={(e) => handleChange(0, e)}
                required
                inputProps={{ maxLength: 10 }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode < 48 || charCode > 57) {
                    e.preventDefault();
                  }
                }}
                variant="outlined"
                id="outlined-basic"
                label="Phone No"
              />
            </div>
            <div class="col-md-3 mb-3">
              <DatePicker
                placeholder="Select Date"
                className="col-md-12"
                name="customer_delivery_time"
                defaultValue={new Date(Cookies.get("order_date"))}
                onChange={(date) => handle_get_order_date(0, date)}
                // dateFormat="yyyy-MM-dd"
                
              />
              {/* <DatePicker
                placeholder="Select Date"
                className="col-md-12"
                name="customer_delivery_time"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                value={formatDate(selectedDate)}
              /> */}
              {/* <DatePicker
                placeholder="Select Date"
                className="col-md-12"
                name="customer_delivery_time"
                // defaultValue={new Date("Thu May 23 2024 11:04:33 GMT+0530 (India Standard Time)")}
                defaultValue={new Date(`${selectedDate.order_date}`)}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
              /> */}
            </div>
            <div className="col-md-12 mb-3">
              <TextField
                type="text"
                className="form-control custom-margin"
                placeholder="Address"
                name="addr"
                value={sections[0].addr}
                onChange={(e) => handleChange(0, e)}
                required
                tabIndex="0"
                id="outlined-basic"
                label="Address"
                variant="outlined"
              />
            </div>
          </div>
          {sections.map((section, index) => (
            <div key={index}>
              <form
                className="user_lead_form mt-2"
                // onSubmit={(e) => handle_submit(e)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  width: "90%",
                  paddingTop : "26px"
                }}
              >
                <p style={{ fontSize: "2em" }}>Zula Items {index + 1}</p>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => removeSection(index)}
                  >
                    x
                  </button>
                </div>
                <div class="row">
                  <div class="">
                    <div class="row mb-3">
                      <p
                        style={{
                          fontSize: "1em",
                          fontWeight: "500",
                          textAlign: "start",
                        }}
                      >
                        Zula's Infomrmation:-
                      </p>

                      <div className="col-md-4">
                        {/* <FormControl className="" fullWidth>
                          <InputLabel id="state-select-label">
                            Category
                          </InputLabel>
                          <Select
                            labelId="state-select-label"
                            className="form-control custom-margin"
                            name="zula_category"
                            value={section.zula_category || ""}
                            onChange={(e) => {
                              handleChange(index, e);
                              handle_get_all_zula_category_style(
                                e.target.value
                              );
                              handle_get_default_delivery_time(
                                e,
                                e.target.value
                              );
                            }}
                            defaultValue="" // Default value for the unselected state
                          >
                          
                            {get_zula_category.map((data, index) => (
                              <MenuItem key={index} value={data.zula_category}>
                                {data.zula_category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                        <TextField
                          type="text"
                          className="form-control custom-margin"
                          placeholder="Category"
                          name="zula_category"
                          value={section.zula_category || ""}
                          onChange={(e) => handleChange(index, e)}
                          tabIndex="0"
                          id="outlined-basic"
                          label="Category"
                          variant="outlined"
                        />
                      </div>
                      <div class="col-md-4">
                        {/* <FormControl className="" fullWidth>
                          <InputLabel id="state-select-label">Style</InputLabel>
                          <Select
                            labelId="state-select-label"
                            className="form-control custom-margin"
                            name="zula_style"
                            value={section.zula_style || ""}
                            onClick={(e) => {
                              handle_get_all_zula_category_style(
                                section.zula_category
                              );
                              handle_get_default_delivery_time(
                                e,
                                section.zula_category
                              );
                            }}
                            onChange={(e) => {
                              handleChange(index, e);
                              handle_color_of_given_style(
                                e,
                                e.target.value,
                                index
                              );
                            }}
                            defaultValue="" // Default value for the unselected state
                          >
                            {get_zula_category_style.map((data1, index) => (
                              <MenuItem
                                key={index}
                                value={data1.style_name}
                                selected={
                                  section.zula_style == data1.zula_style
                                    ? true
                                    : false
                                }
                              >
                                {data1.style_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                        <TextField
                          type="text"
                          className="form-control custom-margin"
                          placeholder="Style"
                          name="zula_style"
                          value={section.zula_style || ""}
                          onChange={(e) => handleChange(index, e)}
                          tabIndex="0"
                          id="outlined-basic"
                          label="Style"
                          variant="outlined"
                        />
                      </div>
                      <div class="col-md-4">
                        <TextField
                          required
                          className="form-control custom-margin"
                          id="filled-required"
                          label="Default Delivery Time (Days)"
                          variant="filled"
                          disabled
                          value={
                            get_default_delivery_time.min_delivery_time +
                            "-" +
                            get_default_delivery_time.max_delivery_time
                          }
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <TextField
                            type="text"
                            className="form-control custom-margin"
                            placeholder="Zula Size"
                            name="zula_size"
                            value={section.zula_size || ""}
                            onChange={(e) => handleChange(index, e)}
                            tabIndex="0"
                            id="outlined-basic"
                            label="Zula Size"
                            variant="outlined"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <input
                            type="file"
                            id="file-input"
                            className="form-control custom-margin"
                            style={{ height: "56px" }}
                            onChange={(e) => handleFileChange(index, e)}
                            multiple
                          />
                          <button
                            type="button"
                            onClick={handleAddImages}
                            className="btn btn-success mt-2"
                          >
                            Add Images
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="">
                          {/* <FormControl className="" fullWidth>
                            <InputLabel id="state-select-label">
                              Color
                            </InputLabel>
                            <Select
                              labelId="state-select-label"
                              className="form-control custom-margin"
                              name="zula_color"
                              value={section.zula_color || ""}
                              onClick={(e) => {
                                handle_color_of_given_style(
                                  e,
                                  section.zula_style,
                                  index
                                );
                              }}
                              onChange={(e) => handleChange(index, e)}
                              // defaultValue="" // Default value for the unselected state
                            >
                              {get_style_color.map((data1, index) => (
                                <MenuItem
                                  key={index}
                                  value={data1.color_name}
                                  selected={
                                    data.zula_color == data1.color_name
                                      ? true
                                      : false
                                  }
                                >
                                  {data1.color_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl> */}
                          <TextField
                            type="text"
                            className="form-control custom-margin"
                            placeholder="Color"
                            name="zula_color"
                            value={section.zula_color || ""}
                            onChange={(e) => handleChange(index, e)}
                            tabIndex="0"
                            id="outlined-basic"
                            label="Color"
                            variant="outlined"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="show_multiple_images_container">
                    {section.images.map((data) => {
                      return (
                        <>
                          <img
                            src={`${API_URL}/uploads/${data.imageName}`}
                            alt=""
                            style={{height:"100px" , width:"100px"}}

                          />
                          <button className="btn btn-secondary" style={{height:"40px"}} onClick={(e)=>handle_edit_single_image(e,data._id,data.imageName)}>Edit</button>
                        </>
                      );
                    })}
                  </div> */}
                  <div className="show_multiple_images_container">
                    {section.images.map((data) => (
                      <div key={data._id}>
                        {/* <img
                          src={`${API_URL}/uploads/${data.imageName}`}
                          alt=""
                          style={{ height: "100px", width: "100px" , marginRight:"3px"}}
                        /> */}
                        {/* <button
                          className="btn btn-secondary"
                          data-bs-toggle="modal"
                          data-bs-target="#editImagesModal"
                          style={{ fontSize:"1px" }}
                          onClick={(e) => handleEditButtonClick(e, data)}
                        >
                        </button> */}
                        {/* <EditIcon
                              data-bs-toggle="modal"
                          data-bs-target="#editImagesModal"
                          style={{ fontSize:"1.5em" , position:"absolute" }}
                          onClick={(e) => handleEditButtonClick(e, data)}
                          /> */}
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            // backgroundColor: "black",
                            background: `url("${API_URL}/uploads/${data.imageName}")`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                          }}
                        >
                          <EditIcon
                            data-bs-toggle="modal"
                            data-bs-target="#editImagesModal"
                            style={{
                              fontSize: "1.5em",
                              position: "relative",
                              left: "60px",
                              backgroundColor: "#ffffffa3",
                              cursor: "pointer",
                            }}
                            onClick={(e) => handleEditButtonClick(e, data)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "1em",
                      fontWeight: "500",
                      textAlign: "start",
                    }}
                  >
                    Cusion And Pillow Infomrmation:-
                  </p>
                  <div className="col-md-6 mb-3">
                    <TextField
                      type="text"
                      multiline
                      rows={5}
                      className="form-control custom-margin"
                      placeholder="Cusion Information"
                      name="cusion_info"
                      value={section.cusion_info || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined-basic"
                      label="Cusion Information"
                      variant="outlined"
                      
                    />
                    
                  </div>
                  <div class="col-md-6 mb-1">
                    <TextField
                      type="text"
                      multiline
                      rows={5}
                      className="form-control custom-margin "
                      placeholder="Pillow Information"
                      name="pillow_info"
                      value={section.pillow_info || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined-basic"
                      label="Pillow Information"
                      variant="outlined"
                    />
                  </div>
                 
                  <p
                    style={{
                      fontSize: "1em",
                      fontWeight: "500",
                      textAlign: "start",
                    }}
                  >
                    Chain's Infomrmation:-
                  </p>
                  <div className="col-md-6 mb-3">
                    {/* <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Chain Type"
                      name="chain_type"
                      value={section.chain_type || ""}
                      onChange={(e) => handleChange(index, e)}
                      required
                      tabIndex="0"
                      id="outlined-basic"
                      label="Chain Type"
                      variant="outlined"
                    /> */}
                    {/* <FormControl className="" fullWidth>
                      <InputLabel id="state-select-label">
                        Chain Types
                      </InputLabel>
                      <Select
                        labelId="state-select-label"
                        className="form-control custom-margin"
                        name="chain_type"
                        // value={section.color_name || ""}
                        onChange={(e) => handleChange(index, e)}
                        // defaultValue={section.chain_type || ""} // Default value for the unselected state
                        value={section.chain_type}
                      >
                        {get_chain_type.map((data1, index) => (
                          <MenuItem key={index} value={data1.chain_type} 
                          selected={section.chain_type === data1.chain_type ? true : false}
                          >
                            {data1.chain_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Chain Types"
                      name="chain_type"
                      value={section.chain_type || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined-basic"
                      label="Chain Types"
                      variant="outlined"
                      //   inputProps={{ min: "0" }}
                    />
                    {/* <select name="" id=""></select> */}
                  </div>
                  <div className="col-md-6">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Chain Size (From Kada to Floor)"
                      name="chain_size"
                      value={section.chain_size || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined-basic"
                      label="Chain Size (From Kada to Floor)"
                      variant="outlined"
                      //   inputProps={{ min: "0" }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "1em",
                      fontWeight: "500",
                      textAlign: "start",
                    }}
                  >
                    Other Infomrmation:-
                  </p>
                  <div className="col-md-6 ">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Special Accessories"
                      name="special_accessories"
                      value={section.special_accessories || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined-basic"
                      label="Special Accessories"
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <TextField
                      multiline
                      className="form-control custom-margin"
                      placeholder="Note"
                      name="note_msg"
                      value={section.note_msg || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Note"
                      variant="outlined"
                      InputProps={{ style: { resize: "none" } }} // Make sure this is placed correctly
                      style={{ resize: "none" }} // You can also try applying directly to the TextField
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Price"
                      name="price"
                      value={section.price || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Price"
                      variant="outlined"
                      inputProps={{ min: "0" }}
                      InputLabelProps={{ shrink: true }} // Shrinks the label when focused or filled

                      disabled={Cookies.get("role") == "admin" ? false : true}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Advance Payment"
                      name="adv_price"
                      value={section.adv_price || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Advance Payment"
                      variant="outlined"
                      inputProps={{ min: "0" }}
                      // disabled={Cookies.get("role") == "admin" ? false : true}
                      InputLabelProps={{ shrink: true }} // Shrinks the label when focused or filled

                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Pending Payment"
                      name="pending_price"
                      value={section.pending_price || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Pending Payment"
                      variant="outlined"
                      inputProps={{ min: "0" }}
                      InputLabelProps={{ shrink: true }} // Shrinks the label when focused or filled
                      disabled
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Remarks"
                      name="remarks"
                      value={section.remarks || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Remarks"
                      variant="outlined"
                      inputProps={{ min: "0" }}
                      InputLabelProps={{ shrink: true }} // Shrinks the label when focused or filled
                      disabled={Cookies.get("role") == "admin" ? false : true}

                    />
                  </div>
                </div>
              </form>

              {/* Add more fields as needed */}
              {/* <Button onClick={() => removeSection(index)}>Remove</Button> */}
            </div>
          ))}

          <button
            type="submit"
            class="btn btn-primary mt-3 mb-3"
            style={{ width: "150px" }}
          >
            Edit
          </button>
        </form>

        <div
          className="modal fade"
          id="editImagesModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Image
                </h5>
                <button
                  type="button"
                  className="close btn btn-secondary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSingleImage}>
                  <div className="form-group"></div>
                  <div className="form-group">
                    <label htmlFor="imageFile">Choose New Image</label>
                    <input
                      type="file"
                      className="form-control-file"
                      id="imageFile"
                      // onChange={handleFileChange1}
                      ref={handle_edit_imageRef}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleEditSingleImage}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default Shop_M_Edit_Order;
