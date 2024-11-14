import React, { useEffect, useState } from "react";
import "../Login/Login.css";
import company_logo1 from "../../../User/Components/User_Lead/Assets/logo1.PNG";
import axios from "axios";
import { toast } from "react-toastify";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Cookies from "js-cookie";
import { API_URL } from "../../../config";
import forget_pass_img from './Assets/forget_pass_img.png'
import { useNavigate } from "react-router-dom";

const Forget_Password = () => {
  const [data, setData] = useState();
  const [showEyeIcon, setShowEyeIcon] = useState(false);

  const handle_Change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate()
  useEffect(() => {
    Cookies.remove("id");
  }, []);
  const handle_Submit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/change_password_of_user`, data).then((res) => {
      if (res.data.success == true) {
        console.log(res.data.length);

        console.log("Matched...");
        toast.success("Password Changed !!!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { fontFamily: "poppins" },
          // transition: Bounce,
        });
        navigate('/')
      } else {
        toast.error("Username And Password Not Matched...", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: { fontFamily: "poppins" }, 
          // transition: Bounce,
        });
      } 
    });
  };

  const handle_showPassword = () => {
    setShowEyeIcon(!showEyeIcon);
  };

  return (
    <section class="vh-98">
      <div style={{ width: "100%", display: "flex" }}>
        <img
          src={company_logo1}
          className="img-fluid admin_login_comapny_logo1 "
        />
      </div>
      <div class="container py-5 h-100">
        <div class="row d-flex align-items-center justify-content-center h-100">
          <div class="col-md-8 col-lg-7 col-xl-6">
            <img
            //   src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              src={forget_pass_img}
              class="img-fluid mb-4"
              alt="Phone image"
            />
          </div>
          <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form
              className="admin_login_form1"
              onSubmit={(e) => handle_Submit(e)}
            >
              <div
                style={{
                  width: "100%",
                  marginBottom: "10%",
                  fontSize: "1.54em",
                  fontWeight: "400",
                }}
              >
                Forget Password
              </div>
              <div
                data-mdb-input-init
                class="form-outline mb-4"
                style={{ textAlign: "start" }}
              >
                <label class="form-label" for="form1Example13">
                  Username
                </label>
                <input
                  type="text"
                  id="form1Example13"
                  class="form-control form-control-lg"
                  required
                  name="username"
                  onChange={(e) => handle_Change(e)}
                  style={{ textTransform: "none" }}
                />
              </div>

              {/* <div data-mdb-input-init class="form-outline mb-4" style={{textAlign:"start"}}>
            <label class="form-label" for="form1Example23" >Password</label>
            <input type="password" id="form1Example23" class="form-control form-control-lg" required name='password' onChange={(e)=>handle_Change(e)}/>
          </div> */}

              <div
                data-mdb-input-init
                class="form-outline mb-4"
                style={{ textAlign: "start" }}
              >
                <label class="form-label" for="form1Example23">
                  Phone No
                </label>
                <div class="input-group">
                  <input
                  type="number"
                    id="form1Example23"
                    class="form-control form-control-lg"
                    required
                    name="wh_ph_no"
                    onChange={(e) => handle_Change(e)}
                    style={{ textTransform: "none" }}
                  />
                 
                </div>
              </div>
              <div
                data-mdb-input-init
                class="form-outline mb-4"
                style={{ textAlign: "start" }}
              >
                <label class="form-label" for="form1Example23">
                  Password
                </label>
                <div class="input-group">
                  <input
                    type={showEyeIcon == false ? "password" : "text"}
                    id="form1Example23"
                    class="form-control form-control-lg"
                    required
                    name="password"
                    onChange={(e) => handle_Change(e)}
                    style={{ textTransform: "none" }}
                  />
                  <button
                    class="btn"
                    type="button"
                    id="togglePassword"
                    style={{ border: "1px solid rgb(223, 226, 230)" }}
                    onClick={() => handle_showPassword()}
                  >
                    {showEyeIcon == false ? (
                      <RemoveRedEyeIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </button>
                </div>
              </div>

              <div class="d-flex justify-content-around align-items-center mb-4">
                <div class="form-check">
                  {/* <input class="form-check-input" type="checkbox" value="" id="form1Example3" checked /> */}
                  {/* <label class="form-check-label" for="form1Example3"> Remember me </label> */}
                </div>
                {/* <a href="#!">Forgot password?</a> */}
              </div>

              <button
                type="submit"
                data-mdb-button-init
                data-mdb-ripple-init
                class="btn btn-primary btn-lg btn-block"
              >
                Sign in
              </button>

              {/* <div class="divider d-flex align-items-center my-4">
            <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
          </div>

          <a data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{backgroundColor: "#3b5998"}} href="#!"
            role="button">
            <i class="fab fa-facebook-f me-2"></i>Continue with Facebook
          </a>
          <a data-mdb-ripple-init class="btn btn-primary btn-lg btn-block" style={{backgroundColor: "#55acee"}} href="#!"
            role="button">
            <i class="fab fa-twitter me-2"></i>Continue with Twitter</a> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forget_Password;
