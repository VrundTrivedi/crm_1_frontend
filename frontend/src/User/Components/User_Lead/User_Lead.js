import React, { useEffect, useRef, useState } from "react";
import "../User_Lead/User_Lead.css";
import logo1 from "../User_Lead/Assets/logo1.PNG";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route } from "react-router-dom";
import Thank_You_Page from "./Thank_you/Thank_You_Page";
import Cookies from "js-cookie";
import { API_URL } from "../../../config";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import CallIcon from "@mui/icons-material/Call";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Shop2Outlined } from "@mui/icons-material";
import facebook from "./Assets/icons8-facebook-50.png";
import insta from "./Assets/icons8-instagram-50.png";
import linkedin from "./Assets/icons8-linkedin-50.png";
import youtube from "./Assets/icons8-youtube-50.png";
import twitter from "./Assets/icons8-twitter-50.png";

const User_Lead = () => {
  const [data, setData] = useState({ status: "pending" });
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
      // c_wh_no1.current.value = data.c_phno;
      // c_wh_no1.current.disabled = true;
    } else {
      setData({ ...data, c_wh_phno: "" });
      // c_wh_no1.current.value = "";
      // c_wh_no1.current.disabled = false;
    }
  };

  const handel_enable_same_checkbox = () => {
    same_ph_noRef.current.disabled = false;
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("c_name", data.c_name);
    // formData.append("c_addr", data.c_addr);
    // formData.append("c_phno", data.c_phno);
    // formData.append("c_msg", data.c_msg);
    // formData.append("c_see_ads", data.c_see_ads);
    // formData.append("c_state", data.c_state);
    // formData.append("c_city", data.c_city);
    // formData.append("c_area", data.c_area);
    // formData.append("c_wh_phno", data.c_wh_phno);

    // console.log(formData)

    await axios.post(`${API_URL}/add_user_lead_data`, data).then((res) => {
      if (res.data.success == true) {
        console.log("okkk");
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
        window.location = "/thank_you";
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

  // const statesInIndia = [
  //   "Andhra Pradesh",
  //   "Arunachal Pradesh",
  //   "Assam",
  //   "Bihar",
  //   "Chhattisgarh",
  //   "Goa",
  //   "Gujarat",
  //   "Haryana",
  //   "Himachal Pradesh",
  //   "Jharkhand",
  //   "Karnataka",
  //   "Kerala",
  //   "Madhya Pradesh",
  //   "Maharashtra",
  //   "Manipur",
  //   "Meghalaya",
  //   "Mizoram",
  //   "Nagaland",
  //   "Odisha",
  //   "Punjab",
  //   "Rajasthan",
  //   "Sikkim",
  //   "Tamil Nadu",
  //   "Telangana",
  //   "Tripura",
  //   "Uttar Pradesh",
  //   "Uttarakhand",
  //   "West Bengal",
  // ];

  const [option, setOption] = useState("");

  const handleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const [get_areas, set_areas] = useState([]);

  const handle_get_areas = async (e) => {
    console.log(data.c_city);
    console.log(data.c_state);
    await axios
      .post(`${API_URL}/get_areas`, {
        city: e.target.value,
        state: data.c_state,
      })
      .then((res) => {
        console.log(res.data);
        if(!res.data){
          set_areas("others")
        }
        else{
          set_areas(res.data);

        }
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

  useEffect(() => {
    same_ph_noRef.current.disabled = true;
    handle_get_states();
  }, []);

  return (
    <div>
      {/* <nav class="navbar navbar-dark bg-dark">
 
    </nav> */}
      <div class="nav_logo_container">
        <img class="navbar-brand navbar-brand-name nav_bar_logo1" src={logo1} />
      </div>
      <div class="container">
        <div class="header">
          <h3></h3>
        </div>
        <form className="user_lead_form mb-4" onSubmit={(e) => handle_submit(e)}>
          <div
            style={{
              fontFamily: "Oswald",
              fontSize: "3em",
              marginBottom: "4%",
              letterSpacing: "1px",
              fontWeight: "600",
            }}
          >
            INQUIRY
            <span className="user_lead_form_title_txt1 mr-2">FORM</span>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <input
                  type="text"
                  class="form-control custom-margin"
                  placeholder="Full Name"
                  name="c_name"
                  onChange={(e) => handle_change_input(e)}
                  autoFocus
                  required
                  tabIndex="0"
                />
              </div>
              {/* <div class="mb-3">
                <textarea
                  type="text"
                  rows={1}
                  class="form-control custom-margin"
                  placeholder="Address"
                  name="c_addr"
                  onChange={(e) => handle_change_input(e)}
                  required
                  style={{ resize : "none" }}
                />
              </div> */}
              <div class="mb-3">
                <input
                  type="tel"
                  class="form-control custom-margin"
                  placeholder="Phone No"
                  name="c_phno"
                  onChange={(e) => handle_change_input(e)}
                  onBlur={() => handel_enable_same_checkbox()}
                  required
                  maxLength={10}
                  onKeyPress={(e) => {
                    // Get the pressed key
                    const charCode = e.which ? e.which : e.keyCode;
                    // Allow digits (0-9) and control keys like backspace and delete
                    if (charCode < 48 || charCode > 57) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div class="mb-3" style={{ textAlign: "start" }}>
                <label style={{ width: "100%" }}>
                  <input
                    type="checkbox"
                    class=""
                    value="same"
                    style={{ marginRight: "4%" }}
                    onClick={(e) => handle_same_phno(e)}
                    ref={same_ph_noRef}
                  />
                  {/* Same As Phone Number */}
                  This Is My WhatsApp No
                </label>
              </div>
              {/* <div class="mb-3">
                <textarea
                  type="text"
                  class="form-control custom-margin"
                  placeholder="Inquiry Message"
                  name="c_msg"
                  rows={1}
                  onChange={(e) => handle_change_input(e)}
                  required
                  style={{ resize : "none" }}

                />
              </div> */}
              {/* <div class="mb-3">
                <select
                  class="form-control custom-margin"
                  name="c_see_ads"
                  onChange={(e) => handle_change_input(e)}
                  style={{ height : "38px" }}
                >
                  <option disabled selected>
                    ---- Where did you see this ----
                  </option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Website">Website</option>
                  <option value="Ads">Ads</option>
                </select>
              </div> */}
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                {/* <input
                    type="text"
                    class="form-control 
                                        custom-margin"
                    placeholder="State"
                    name="c_state"
                    onChange={(e) => handle_change_input(e)}
                    required
                  /> */}
                <select
                  class="form-control custom-margin"
                  name="c_state"
                  onClick={(e) => {
                    handle_get_cities(e);
                  }}
                  onChange={(e) => {
                    handle_change_input(e);
                    handle_get_cities(e);
                  }}
                  style={{ height : "38px" }}

                >
                  <option disabled selected>
                    ---- Select State ----
                  </option>
                  {get_states.map((data) => {
                    return (
                      <>
                        <option value={data.state}>{data.state}</option>
                      </>
                    );
                  })}
                </select>
              </div>

              <div class="mb-3">
                {/* <input
                    type="text"
                    class="form-control custom-margin"
                    placeholder="City"
                    name="c_city"
                    onChange={(e) => handle_change_input(e)}
                    onBlur={(e)=>handle_get_areas(e)}
                    required
                  /> */}
                <select
                  class="form-control custom-margin"
                  name="c_city"
                  onClick={(e) => {
                    handle_change_input(e);
                  }}
                  onChange={(e) => {
                    handle_change_input(e);
                    handle_get_cities(data.c_state);
                    handle_get_areas(e);
                  }}
                  style={{ height : "38px" }}

                >
                  <option disabled selected>
                    ---- Select City ----
                  </option>
                  {get_cities.map((data) => {
                    return (
                      <>
                        <option value={data.city}>{data.city}</option>
                      </>
                    );
                  })}
                </select>
              </div>
              {/* <div class="mb-3">
                  <select
                    class="form-control custom-margin"
                    name="c_area"
                  
                    onChange={(e) => handle_change_input(e)}
                  >
                    <option disabled selected>
                      ---- Select Area ----
                    </option>
                    {get_areas.map((data) => {
                      return (
                        <>
                          <option value={data}>{data}</option>
                        </>
                      );
                    })}
                  </select>
                </div>   */}
              {get_areas && (
                <div className="mb-3">
                  <select
                    className="form-control custom-margin"
                    name="c_area"
                    onChange={(e) => handle_change_input(e)}
                    // value={formData.c_area}
                  style={{ height : "38px" }}
                  required

                  >
                    <option disabled selected>
                      ---- Select Area ----
                    </option>
                    {get_areas.map((data, index) => (
                      <option key={index} value={data.area}>
                        {data.area}
                      </option>
                    ))}
                  </select>
                </div>
              )}
             
              {/* <div class="mb-3 ">
                <input
                  type="tel"
                  class="form-control
                                      custom-margin"
                  placeholder="WhatsApp No"
                  name="c_name"
                  onChange={(e) => handle_change_input(e)}
                  ref={c_wh_no1}
                  inputmode="numeric"
                  required
                  maxLength={10}
                  onKeyPress={(e) => {
                    // Get the pressed key
                    const charCode = e.which ? e.which : e.keyCode;
                    // Allow digits (0-9) and control keys like backspace and delete
                    if (charCode < 48 || charCode > 57) {
                      e.preventDefault();
                    }
                  }}
                  style={{ marginTop : "29px" }}
                />
              </div> */}
              {/* <div class="mb-3">
                <input
                  type="text"
                  class="form-control custom-margin"
                  placeholder="Product Link"
                  name="product_link"
                  onChange={(e) => handle_change_input(e)}
                />
              </div> */}
            </div>

            <button type="submit" className="btn submit_btn">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="contact_info_container">
        <div className="contact_info_container1 row">
          <div className="contact_info_box col-md-4 col-sm-12">
            <div className="contact_info_box_icon">
              <LocalPostOfficeIcon />
            </div>
            <div className="contact_info_box_content">
              <div>
                Send E-Mail <br />
                <span style={{ fontSize: "16px" }}>thezulahouse@gmail.com</span>
              </div>
            </div>
          </div>
          <div className="contact_info_box col-md-4 col-sm-12">
            <div className="contact_info_box_icon">
              <CallIcon />
            </div>
            <div className="contact_info_box_content">
              <div>
                Call Anytime
                <br />
                <span style={{ fontSize: "16px" }}>+91 9157643643</span>
              </div>
            </div>
          </div>
          <div className="contact_info_box col-md-4 col-sm-12">
            <div className="contact_info_box_icon">
              <StorefrontIcon />
            </div>
            <div className="contact_info_box_content">
              <div>
                Open Hours
                <br />
                <span style={{ fontSize: "16px" }}>09:30 AM to 07:30 PM</span>
              </div>
            </div>
          </div>
          <div className="social_media_icons_container">
              <a href="https://www.instagram.com/thezulahouse/">

              <div className="social_media_icons_container2">
                <img src={insta} alt="" className="social_media_icons" />
              </div>
              </a>
              <a href="https://in.linkedin.com/in/the-zula-house-743465276?original_referer=https%3A%2F%2Fwww.google.com%2F">
              <div className="social_media_icons_container2">
                <img src={linkedin} alt="" className="social_media_icons" />
              </div>
                
              </a>
              <a href="https://www.facebook.com/designerzula/">

              <div className="social_media_icons_container2">
                <img src={facebook} alt="" className="social_media_icons" />
              </div>
              </a>
              <a href="https://x.com/i/flow/login?redirect_after_login=%2Fthezulahouse">

              <div className="social_media_icons_container2">
                <img src={twitter} alt="" className="social_media_icons" />
              </div>
              </a>
              <a href="https://www.youtube.com/channel/UCWO1z9f-R3PLWPJn3An2b4w">
                
              <div className="social_media_icons_container2">
                <img src={youtube} alt="" className="social_media_icons" />
              </div>
              </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User_Lead;
