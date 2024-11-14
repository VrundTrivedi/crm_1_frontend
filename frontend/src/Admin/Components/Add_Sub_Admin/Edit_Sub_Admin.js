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

const Edit_Sub_Admin = () => {
  const [data, setData] = useState([{ state: "", city: "", area: "" }]);
  const same_ph_noRef = useRef(); // use for checkbox
  const c_wh_no1 = useRef(); //use for fill text box

  const handle_change_input = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handle_same_phno = (e) => {
    // e.preventDefault()
    setData({ ...data, c_wh_phno: data.c_phno });
    // console.log(same_ph_noRef.current.checked)
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
    await axios.post(`${API_URL}/edit_sub_admin_data`, data).then((res) => {
      if (res.status == 200) {
        console.log("okkk");
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
        Cookies.remove("id_edit_sub_admin_info");
        window.location = "/show_sub_admin_list";
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
    console.log(data.c_city);
    console.log(data.c_state);
    await axios
      .post(`${API_URL}/get_areas`, { city: data.city, state: data.state })
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
        .post(`${API_URL}/get_cities`, { state: data.state })
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

  const handle_get_admin_data = async () => {
    await axios
      .post(`${API_URL}/get_data_for_edit_sub_admin`, {
        id: Cookies.get("id_edit_sub_admin_info"),
      })
      .then((res) => {
        if (res.data.success == true) {
          console.log(res.data.data);
          setData(res.data.data[0]);
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

  useEffect(() => {
    handle_get_admin_data();
    handle_get_states();
    // handle_get_cities();
    // handle_get_areas();
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
                  Edit Sub Users
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
                          required
                          tabIndex="0"
                          id="outlined-basic"
                          label="Name"
                          variant="outlined"
                          value={data.name || ""}
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
                          value={data.email || ""}
                        />
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div className="col-md-6">
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
                          value={data.username || ""}
                        />
                      </div>
                      <div class="col-md-6">
                        <TextField
                          type="text"
                          className="form-control custom-margin"
                          placeholder="Password"
                          name="password"
                          onChange={(e) => handle_change_input(e)}
                          id="outlined-basic"
                          label="Password"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4 mb-1">
                    <select
                      name="state"
                      onClick={(e)=>{handle_get_cities(e);}}
                      onChange={(e) => {
                        handle_change_input(e);
                        handle_get_cities(e);
                      }}
                    >
                      {get_states.map((data1, index) => (
                        <option
                          key={index}
                          value={data1.state}
                          selected={
                            typeof data?.state === "string" &&
                            typeof data1?.state === "string" &&
                            data.state.toLowerCase() ===
                              data1.state.toLowerCase()
                          }
                        >
                          {data1.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="col-md-4 mb-1">
                    <select
                      name="city"
                      onClick={(e)=>{handle_get_cities(data.city);handle_get_areas(e);  }}
                      onLoad={(e)=>{handle_get_cities(data.city);}}
                      onChange={(e) => {
                        handle_change_input(e);
                        handle_get_areas(e);
                      }}
                    >
                      {get_cities.map((data1, index) => (
                        <option
                          key={index}
                          value={data1.city}
                          selected={
                            data.city.toLowerCase() == data1.city.toLowerCase()
                              ? true
                              : false
                          }
                        >
                          {data1.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <select
                      name="area"
                      onChange={(e) => handle_change_input(e)}
                    >
                      {get_areas.map((data1, index) => (
                        <option
                          key={index}
                          value={data1.area}
                          selected={
                            data.area.toLowerCase() == data1.area.toLowerCase()
                              ? true
                              : false
                          }
                        >
                          {data1.area}
                        </option>
                      ))}
                    </select>
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
                      value={data.ph_no || ""}
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
                      value={data.wh_ph_no || ""}
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
                      value={data.salary || ""}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <select
                      name="role"
                      onChange={(e) => handle_change_input(e)}
                    >
                      <option disabled value="">
                        ---- Role ----
                      </option>
                      <option selected={data.role == "admin"} value="admin">
                        Admin
                      </option>
                      <option selected={data.role == "shop_m"} value="shop_m">
                        Shop Manager
                      </option>
                      <option
                        selected={data.role == "factory_m"}
                        value="factory_m"
                      >
                        Factory Manager
                      </option>
                    </select>
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
                      value={data.note || ""}
                    />
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">
                  Edit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit_Sub_Admin;
