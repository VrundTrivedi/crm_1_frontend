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
import Loaderrr from "../../../Loader/Loader";

const DynamicForm11 = () => {

  const isAdmin = Cookies.get("role") === "admin";

  const initialSections = {
    challan_no: "-",
    order_date: null,
    full_name: "-",
    ph_no: "-",
    addr: "-",
    zula_category: "-",
    zula_style: "-",
    zula_color: "-",
    pillow_info: "-",
    cusion_info: "-",
    zula_size: "-",
    chain_type: "-",
    chain_size: "-",
    special_accessories: "-",
    note_msg: "-",
    remarks : "-",
    price: 0,
    adv_price : 0,
    pending_price : 0,
    customer_delivery_time: null,
    status: "",
    images: [],
    o_state: Cookies.get("state"),
    o_area: Cookies.get("area"),
    update_log: `Order Created On ${new Date().toLocaleDateString()}`,
    order_by: Cookies.get("admin_username"),
  };
  
  if (isAdmin) {
    initialSections.o_city = "admin";
  }
  else{
    initialSections.o_city = Cookies.get('city');

  }
  
  const [sections, setSections] = useState([initialSections]);
  const [get_loader, set_loader] = useState(false);

  const navigate = useNavigate()
  
  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedSections = [...sections];
    updatedSections[index].images = files;
    setSections(updatedSections);
  };

  const addSection = () => {
    const newSection = { ...initialSections };
    delete newSection.challan_no; // Remove the images array
    delete newSection.order_date; // Remove the images array
    delete newSection.full_name; // Remove the images array
    delete newSection.ph_no; // Remove the images array
    delete newSection.addr; // Remove the images array

    // Add the new section to the sections state
    setSections([...sections, newSection]);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    if(name == "adv_price"){
      updatedSections[index].pending_price = updatedSections[index].price - value
    
    }
    if(name == "price"){
      updatedSections[index].pending_price = value -  updatedSections[index].adv_price
    
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
  const formatDate = (date) => {
    if (!date) return ""; // Return empty string if date is null or undefined
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  };

  const handle_get_order_date = (index, date) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      order_date: date,
    };
    setSections(updatedSections);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    set_loader(true)
    const formData = new FormData();

    sections.forEach((section, index) => {
      formData.append(`section_${index}`, JSON.stringify(section));

      if (section.images && section.images.length > 0) {
        section.images.forEach((file, fileIndex) => {
          // formData.append("images", file); // Use the same field name as in upload.array()
          formData.append(`section_${index}_images`, file); // Use the same field name as in upload.array()
        });
      }
    });

    console.log(formData);

    await axios.post(`${API_URL}/shop_m_add_order`, formData).then((res) => {
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
        set_loader(false)

        // window.location.href = "/get_shop_m_all_orders";
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

  const [data, setData] = useState({ color_name: "" });
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

  useEffect(() => {
    handle_get_states();
    // window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {get_loader ? <Loaderrr /> : null}
    
      <center>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              fontFamily: "poppins",
              fontSize: "2em",
            }}
            className="mb-1"
          >
            Add Order
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
                // value={section.full_name || ""}
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
                // value={section.full_name || ""}
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
                // value={section.ph_no || ""}
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
                placeholder="Select Order Date"
                className="col-md-12"
                name="customer_delivery_time"
                value={sections[0]?.order_date}
                onChange={(date) => handle_get_order_date(0, date)}
                // dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="col-md-12 mb-3">
              <TextField
                type="text"
                className="form-control custom-margin"
                placeholder="Address"
                name="addr"
                // value={section.full_name || ""}
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
              {/* <TextField
              type="text"
              name="fullName"
              label="Full Name"
              value={section.fullName || ""}
              onChange={(e) => handleChange(index, e)}
            /> */}
              <form
                className="user_lead_form mt-2"
                // onSubmit={(e) => handle_submit(e)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  width: "90%",
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
                          className="form-control custom-margin mb-3"
                          placeholder="Zula Category"
                          name="zula_category"
                          // value={section.zula_category || ""}                       
                          onChange={(e) => handleChange(index, e)}
                          tabIndex="0"
                          id="outlined-basic"
                          label="Zula Category"
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
                            {get_zula_category_style.map((data, index) => (
                              <MenuItem key={index} value={data.style_name}>
                                {data.style_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                        <TextField
                          type="text"
                          className="form-control custom-margin mb-3"
                          placeholder="Zula Style"
                          name="zula_style"
                          // value={section.zula_style || ""}                       
                          onChange={(e) => handleChange(index, e)}
                          tabIndex="0"
                          id="outlined-basic"
                          label="Zula Style"
                          variant="outlined"
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="">
                          <TextField
                          type="text"
                          className="form-control custom-margin mb-3"
                          placeholder="Zula Color"
                          name="zula_color"
                          // value={section.zula_color || ""}                       
                          onChange={(e) => handleChange(index, e)}
                          tabIndex="0"
                          id="outlined-basic"
                          label="Zula Color"
                          variant="outlined"
                        />
                        </div>
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
                            // value={section.zula_size || ""}
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
                          {/* <input
                            type="file"
                            className="form-control custom-margin"
                            // placeholder="Zula Size"
                            name="images"
                            // value={section.zula_size || ""}
                            onChange={(e) => handleFileChange(index, e)}
                            required
                            tabIndex="0"
                            id="outlined-basic"
                            // label="Zula Size"
                            variant="outlined"
                            multiple
                          /> */}
                          <input
                            type="file"
                            className="form-control custom-margin"
                            style={{ height: "56px" }}
                            onChange={(e) => handleFileChange(index, e)}
                            multiple
                          />
                        </div>
                      </div>
                    </div>
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
                      // value={section.cusion_info || ""}
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
                      // value={section.pillow_info || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined-basic"
                      label="Pillow Information"
                      variant="outlined"
                    />
                  </div>
                  
                  {/* <p
                    style={{
                      fontSize: "1em",
                      fontWeight: "500",
                      textAlign: "start",
                    }}
                  >
                    Pillow's Infomrmation:-
                  </p> */}
                  
                 

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
                        // defaultValue="" // Default value for the unselected state
                      >
                        {get_chain_type.map((data, index) => (
                          <MenuItem key={index} value={data.chain_type}>
                            {data.chain_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    <TextField
                          type="text"
                          className="form-control custom-margin mb-3"
                          placeholder="Chain Type"
                          name="chain_type"
                          // value={section.chain_type || ""}                       
                          onChange={(e) => handleChange(index, e)}
                          tabIndex="0"
                          id="outlined-basic"
                          label="Chain Type"
                          variant="outlined"
                        />
                  </div>
                  <div className="col-md-6">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Chain Size (From Kada to Floor)"
                      name="chain_size"
                      // value={section.chain_size || ""}
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
                      // value={section.special_accessories || ""}
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
                      // value={section.note_msg || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Note"
                      variant="outlined"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Price"
                      name="price"
                      // value={section.price || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Price"
                      variant="outlined"
                      inputProps={{ min: "0" }}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <TextField
                      type="text"
                      className="form-control custom-margin"
                      placeholder="Advance Payment"
                      name="adv_price"
                      // value={section.adv_price || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Advance Payment"
                      variant="outlined"
                      inputProps={{ min: "0" }}
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
                      multiline
                      className="form-control custom-margin"
                      placeholder="Remarks"
                      name="remarks"
                      // value={section.remarks || ""}
                      onChange={(e) => handleChange(index, e)}
                      tabIndex="0"
                      id="outlined"
                      label="Remarks"
                      variant="outlined"
                      disabled={Cookies.get('role') == "admin" ? false : true}
                    />
                    </div>
                </div>
              </form>

              {/* Add more fields as needed */}
              {/* <Button onClick={() => removeSection(index)}>Remove</Button> */}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-success"
            onClick={addSection}
            style={{ marginRight: "10px" }}
          >
            Add Another Product
          </button>
          <button type="submit" class="btn btn-primary mt-3 mb-3">
            Submit
          </button>
        </form>
      </center>
    </div>
  );
};

export default DynamicForm11;
