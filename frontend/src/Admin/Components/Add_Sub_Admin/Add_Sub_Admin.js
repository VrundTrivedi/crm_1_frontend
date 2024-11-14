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

const Add_Sub_Admin = () => {
  const [data, setData] = useState();
  const same_ph_noRef = useRef(); // use for checkbox
  const c_wh_no1 = useRef(); //use for fill text box

  const handle_change_input = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handle_same_phno = (e) => {
    // e.preventDefault()
    setData({ ...data, c_wh_phno: data.c_phno });
    const same_phno_ch = same_ph_noRef.current.checked;
    if (same_phno_ch == true) {
      setData({ ...data, c_wh_phno: data.c_phno });
      c_wh_no1.current.value = data.c_phno;
      c_wh_no1.current.disabled = true;
    } else {
      setData({ ...data, c_wh_phno: "" });
      c_wh_no1.current.value = "";
    }
  };

  useEffect(() => {}, []);

  const handle_submit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/add_sub_admin`, data).then((res) => {
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
        window.location = "/add_sub_admin";
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

  const [get_areas, set_areas] = useState([]);

  const handle_get_areas = async (e) => {
    await axios
      .post(`${API_URL}/get_areas`, { city: e.target.value, state: data.state })
      .then((res) => {
        set_areas(res.data);
      });
  };
  const [get_states, set_states] = useState([]);

  const handle_get_states = async () => {
    try {
      await axios.post(`${API_URL}/get_states`).then((res) => {
        if (res.data.success == true) {
          set_states(res.data.data);
        }
      });
    } catch (error) {
    }
  };

  const [get_cities, set_cities] = useState([]);

  const handle_get_cities = async (e) => {
    try {
      await axios
        .post(`${API_URL}/get_cities`, { state: e.target.value })
        .then((res) => {
          if (res.data.success == true) {
            set_cities(res.data.data);
          }
        });
    } catch (error) {
    }
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
                  Add Sub Users
                </div>
                <div class="row">
                  <div class="">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <TextField
                          type="text"
                          className="form-control custom-margin"
                          placeholder="Name"
                          name="name"
                          onChange={(e) => handle_change_input(e)}
                          autoFocus
                          required
                          tabIndex="0"
                          id="outlined-basic"
                          label="Name"
                          variant="outlined"
                        />
                      </div>
                      <div class="col-md-6 mb-3">
                        <TextField
                          type="email"
                          className="form-control custom-margin"
                          placeholder="Email"
                          name="email"
                          onChange={(e) => handle_change_input(e)}
                          required
                          id="outlined-basic"
                          label="Email"
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div className="col-md-6 password_box_con">
                        <TextField
                          type="text"
                          className="form-control custom-margin"
                          placeholder="Username"
                          name="username"
                          onChange={(e) => handle_change_input(e)}
                          required
                          id="outlined-basic"
                          label="Username"
                          variant="outlined"
                        />
                      </div>
                      <div class="col-md-6 password_box_con" >
                        <TextField
                          type="text"
                          className="form-control custom-margin "
                          placeholder="Password"
                          name="password"
                          onChange={(e) => handle_change_input(e)}
                          required
                          id="outlined-basic"
                          label="Password"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </div>
                  
                    <div class="col-md-4 mb-1">
                      <FormControl className="" fullWidth>
                        <InputLabel id="state-select-label">State</InputLabel>
                        <Select
                          labelId="state-select-label"
                          className="form-control custom-margin"
                          name="state"
                          onChange={(e) => {
                            handle_change_input(e);
                            handle_get_cities(e);
                          }}
                          defaultValue="" // Default value for the unselected state
                        >
                         <MenuItem value="None">
                              None
                            </MenuItem>
                          {get_states.map((data, index) => (
                            <MenuItem key={index} value={data.state}>
                              {data.state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div class="col-md-4 mb-1">
                      {/* <TextField
                        type="text"
                        className="form-control custom-margin"
                        placeholder="City"
                        name="city"
                        onChange={(e) => handle_change_input(e)}
                        onBlur={(e) => handle_get_areas(e)}
                        required
                        id="outlined-basic"
                        label="City"
                        variant="outlined"
                      /> */}
                      <FormControl className="" fullWidth>
                        <InputLabel id="state-select-label">City</InputLabel>
                        <Select
                          labelId="state-select-label"
                          className="form-control custom-margin"
                          name="city"
                          onChange={(e) => {
                            handle_change_input(e);
                            handle_get_areas(e);
                          }}
                          defaultValue="" // Default value for the unselected state
                        >
                        <MenuItem value="None">
                              None
                            </MenuItem>
                          {get_cities.map((data, index) => (
                            <MenuItem key={index} value={data.city}>
                              {data.city}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="col-md-4 mb-1">
                      <FormControl className="mb-3" fullWidth>
                        <InputLabel id="state-select-label">Area</InputLabel>
                        <Select
                          labelId="state-select-label"
                          className="form-control custom-margin"
                          name="area"
                          onChange={(e) => handle_change_input(e)}
                          defaultValue="" // Default value for the unselected state
                        >
                        <MenuItem value="None">
                              None
                            </MenuItem>
                          {get_areas.map((data, index) => (
                            <MenuItem key={index} value={data.area}>
                              {data.area}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                      <div className="col-md-6">
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
                      <div className="col-md-6 mb-3">
                        <TextField
                          type="tel"
                          className="form-control custom-margin"
                          placeholder="WhatsApp Phone No"
                          name="wh_ph_no"
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
                          label="WhatsApp Phone No"
                        />
                      </div>
                    

                    
                      <div className="col-md-4">
                        <TextField
                          type="tel"
                          className="form-control custom-margin"
                          placeholder="Salary"
                          name="salary"
                          onChange={(e) => handle_change_input(e)}
                          required
                          onKeyPress={(e) => {
                            const charCode = e.which ? e.which : e.keyCode;
                            if (charCode < 48 || charCode > 57) {
                              e.preventDefault();
                            }
                          }}
                          variant="outlined"
                          id="outlined-basic"
                          label="Salary"
                        />
                      </div>
                      <div className="col-md-4 ">
                          
                        <FormControl className="mb-3" fullWidth >
                          <InputLabel id="role-select-label">Role</InputLabel>
                          <Select
                            labelId="role-select-label"
                            className="custom-margin"
                            name="role"
                            onChange={(e) => handle_change_input(e)}
                            defaultValue="" // Default value for the unselected role
                          >
                            <MenuItem disabled value="">
                              ---- Role ----
                            </MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="shop_m">Shop Manager</MenuItem>
                            <MenuItem value="factory_m">
                              Factory Manager
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                        <div className="col-md-4">
                        <TextField
                          type="text"
                          className="form-control custom-margin"
                          placeholder="Note"
                          name="note"
                          onChange={(e) => handle_change_input(e)}
                          id="outlined-basic"
                          label="Note"
                          variant="outlined"
                          
                        />
                        </div>
                </div>
                <button type="submit" class="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_Sub_Admin;
