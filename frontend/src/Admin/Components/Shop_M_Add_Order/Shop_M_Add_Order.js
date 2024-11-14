import React, { useEffect, useRef, useState } from "react";
// import "../User_Lead/User_Lead.css";
// import logo1 from "../User_Lead/Assets/logo1.PNG";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "react-router-dom";
// import Thank_You_Page from "./Thank_you/Thank_You_Page";
import Cookies from "js-cookie";
import "../Add_Sub_Admin/Add_Sub_Admin.css";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { API_URL } from "../../../config";
import $ from "jquery";
import { DatePicker } from "rsuite";
import "rsuite/Button/styles/index.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import "../Shop_M_Add_Order/Shop_M_Add_Order.css";

const Shop_M_Add_Order = () => {
  const [data, setData] = useState({ color_name: "" });
  const same_ph_noRef = useRef(); // use for checkbox
  const c_wh_no1 = useRef(); //use for fill text box
  const [get_zula_category, set_zula_category] = useState([]);
  const [get_default_delivery_time, set_default_delivery_time] = useState({
    min_delivery_time: "",
    max_delivery_time: "",
  });

  const handle_change_input = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
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
    handle_get_all_zula_category();
  }, []);

  const handle_submit = async (e) => {
    e.preventDefault();
    // console.log(data.customer_delivery_time)
    await axios.post(`${API_URL}/shop_m_add_order`, data).then((res) => {
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
          // transition: Bounce,
        });
      }
    });
  };

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
  }, []);

  return (
    <div>
      <div>
        <div class="container">
          <div class="header">
            <h3></h3>
          </div>
          <div className="row" style={{ width: "100%" }}>
            <div className="col">
              <fieldset>
                <legend>Login</legend>

                <form
                  className="user_lead_form"
                  onSubmit={(e) => handle_submit(e)}
                  style={{ backgroundColor: "#fff", borderRadius: "20px" }}
                >
                  <div
                    style={{
                      fontFamily: "poppins",
                      fontSize: "2em",
                      marginBottom: "4%",
                    }}
                  >
                    Add Order
                  </div>
                  <div class="row">
                    <div class="">
                      <div className="row">
                        <p
                          style={{
                            fontSize: "1em",
                            fontWeight: "500",
                            textAlign: "start",
                          }}
                        >
                          Personal Infomrmation:-
                        </p>
                        <div className="col-md-6 mb-3">
                          <TextField
                            type="text"
                            className="form-control custom-margin"
                            placeholder="Full Name"
                            name="full_name"
                            onChange={(e) => handle_change_input(e)}
                            autoFocus
                            required
                            tabIndex="0"
                            id="outlined-basic"
                            label="Full Name"
                            variant="outlined"
                          />
                        </div>
                        <div class="col-md-6 mb-3">
                          <TextField
                            type="tel"
                            className="form-control custom-margin"
                            placeholder="Phone No"
                            name="ph_no"
                            onChange={(e) => handle_change_input(e)}
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
                      </div>
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
                          <FormControl className="" fullWidth>
                            <InputLabel id="state-select-label">
                              Category
                            </InputLabel>
                            <Select
                              labelId="state-select-label"
                              className="form-control custom-margin"
                              name="zula_category"
                              onChange={(e) => {
                                handle_change_input(e);
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
                                <MenuItem
                                  key={index}
                                  value={data.zula_category}
                                >
                                  {data.zula_category}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                        <div class="col-md-4">
                          <FormControl className="" fullWidth>
                            <InputLabel id="state-select-label">
                              Style
                            </InputLabel>
                            <Select
                              labelId="state-select-label"
                              className="form-control custom-margin"
                              name="zula_style"
                              onChange={(e) => {
                                handle_change_input(e);
                                handle_color_of_given_style(e, e.target.value);
                              }}
                              defaultValue="" // Default value for the unselected state
                            >
                              {get_zula_category_style.map((data, index) => (
                                <MenuItem key={index} value={data.style_name}>
                                  {data.style_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
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
                              onChange={(e) => handle_change_input(e)}
                              autoFocus
                              required
                              tabIndex="0"
                              id="outlined-basic"
                              label="Zula Size"
                              variant="outlined"
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-6">
                        <div className="color_for_product mb-3">
                          {get_style_color.map((data) => {
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
                          })}
                        </div>
                      </div> */}
                        <div className="col-md-4">
                          <div className="">
                            <FormControl className="" fullWidth>
                              <InputLabel id="state-select-label">
                                Color
                              </InputLabel>
                              <Select
                                labelId="state-select-label"
                                className="form-control custom-margin"
                                name="zula_color"
                                onChange={(e) => {
                                  handle_change_input(e);
                                  // handle_color_of_given_style(e, e.target.value);
                                }}
                                // defaultValue="" // Default value for the unselected state
                              >
                                {get_style_color.map((data, index) => (
                                  <MenuItem key={index} value={data.color_name}>
                                    {data.color_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
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
                      Cusion's Infomrmation:-
                    </p>
                    <div className="col-md-6 mb-3">
                      <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="Cusion Color"
                        name="cusion_color"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined-basic"
                        label="Cusion Color"
                        variant="outlined"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="Cusion Fabric"
                        name="cusion_fabric_type"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined-basic"
                        label="Cusion Fabric"
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
                      Pillow's Infomrmation:-
                    </p>
                    <div class="col-md-4 mb-1">
                      <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="Pillow Color"
                        name="pillow_color"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined-basic"
                        label="Pillow Color"
                        variant="outlined"
                      />
                    </div>
                    <div class="col-md-4 mb-1">
                      <TextField
                        type="number"
                        className="form-control custom-margin"
                        placeholder="Pillow Qty"
                        name="pillow_qty"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined-basic"
                        label="Pillow Qty"
                        variant="outlined"
                        inputProps={{ min: "0" }}
                      />
                    </div>
                    <div class="col-md-4 mb-3">
                      <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="Pillow Fabric"
                        name="pillow_fabric"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined-basic"
                        label="Pillow Fabric"
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
                      <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="Chain Type"
                        name="chain_type"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
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
                        placeholder="Chain Size"
                        name="chain_size"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined-basic"
                        label="Chain Size"
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
                    <div className="col-md-4 ">
                      <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="Special Accessories"
                        name="special_accessories"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        tabIndex="0"
                        id="outlined-basic"
                        label="Special Accessories"
                        variant="outlined"
                      />
                    </div>
                    <div className="col-md-4">
                      {/* <TextField
                      type="date"
                      className="form-control custom-margin"
                      placeholder="Customer Delivery Time"
                      name="customer_delivery_time"
                      onChange={(e) => handle_change_input(e)}
                      autoFocus
                      required
                      tabIndex="0"
                      id="outlined"
                      //   label="Customer Delivery Time"
                      variant="outlined"
                    /> */}
                      <DatePicker
                        placeholder="Select Date"
                        className="col-md-12"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <TextField
                        type="number"
                        className="form-control custom-margin"
                        placeholder="Price"
                        name="price"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        required
                        tabIndex="0"
                        id="outlined"
                        label="Price"
                        variant="outlined"
                        inputProps={{ min: "0" }}
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <TextField
                        multiline
                        className="form-control custom-margin"
                        placeholder="Note"
                        name="note_msg"
                        onChange={(e) => handle_change_input(e)}
                        autoFocus
                        tabIndex="0"
                        id="outlined"
                        label="Note"
                        variant="outlined"
                      />
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Submit
                  </button>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop_M_Add_Order;
