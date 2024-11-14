import React, { useEffect, useState } from "react";
import "../Admin_Dashboard/Admin_Dashboard.css";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CountUp from "react-countup";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { API_URL } from "../../../config";
import Cookies from "js-cookie";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link } from "react-router-dom";
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import tot_orders from './Icons/tot_orders.png'
import pending_orders from './Icons/pending_order.png'
import in_process_orders from './Icons/in_process.png'
import deliverd_orders from './Icons/deliverd.png'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Admin_Dashboard = () => {
  const [admin_dashboard_details, set_admin_dashboardDetails] = useState([]);

  const handle_get_admin_dashboard_details = async () => {
    await axios
      .post(`${API_URL}/get_admin_dashboard_details`, {
        area: Cookies.get("area"),
        role: Cookies.get("role"),
        city: Cookies.get("city"),
      })
      .then((res) => {
        if (res.status == 200) {
          set_admin_dashboardDetails(res.data);
        }
      });
  };
  useEffect(() => {
    handle_get_admin_dashboard_details();
    
  }, []);


 if(Cookies.get("role") == "admin"){
  const formattedRevenue = (number) => {
    if(!number){
      return 0
    }
    if (number < 100000) {
      console.log(number)
      return number.toLocaleString('en-IN'); // Format according to Indian numbering system
    }

    const suffixes = ['', 'K', 'M', 'Cr', 'Tr']; // Suffixes for different number ranges
    const suffixIndex = Math.floor(Math.log(number) / Math.log(1000));
    console.log((number / (1000 ** suffixIndex)).toFixed(1) + suffixes[suffixIndex])
    return (number / (1000 ** suffixIndex)).toFixed(1) + suffixes[suffixIndex];
  };

  return (
    <div className="row admin_dashboard_card_container">
   

   <Tooltip title="Total Order">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card1">
          <div className="dash-box-info">
          <img src={tot_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            {/* <SupervisorAccountIcon
              style={{ fontSize: "36px", color: "white" }}
            /> */}
            <CountUp
              end={admin_dashboard_details.tot_order}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"> 
            <a href="/get_shop_m_all_orders">Total Order Info <ArrowRightAltIcon/></a>
          </div>
        </div>
      </Tooltip>
      <Tooltip title="Total User Leads">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card2">
          <div className="dash-box-info">
            <FormatListBulletedIcon style={{ fontSize: "36px", color: "white" }} />
            <CountUp
              end={admin_dashboard_details.tot_user_leads}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
            </div>
            <div className="box-info-link">
              <Link to="/lead_listing">User Leads Info <ArrowRightAltIcon/></Link>
            </div>
        </div>
      </Tooltip>
      <Tooltip title="Branches Info">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card3">
          <div className="dash-box-info">
            <StoreIcon style={{ fontSize: "36px", color: "white" }} />
            <CountUp
              end={admin_dashboard_details.tot_branches}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"><Link to="/braches_list">Branches Info <ArrowRightAltIcon/></Link></div>
        </div>
      </Tooltip>
      <Tooltip title="Total Deliverd Order">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card4">
          <div className="dash-box-info">
          <img src={deliverd_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            <CountUp
              end={admin_dashboard_details.tot_deliverd_order}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"><a href="/get_shop_m_all_orders?show=deliverd">Total Deliverd Order Info <ArrowRightAltIcon/></a></div>
        </div>
        
      </Tooltip>

      <Tooltip title="Total Revenue">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card5">
          <div className="dash-box-info">
          <CurrencyRupeeIcon style={{ width : "50px" , height : "50px" , color: "white" }}/>
          <div style={{ fontSize: "36px", fontWeight: "500", color: "white" }} >{formattedRevenue(admin_dashboard_details.tot_revenue)}</div>
          {/* <CountUp end={formattedRevenue(2000000000)} style={{ fontSize: "36px", fontWeight: "500", color: "white" }} /> */}
          {/* <CountUp end={500.5} style={{ fontSize: "36px", fontWeight: "500", color: "white" }} /> */}

          </div>
          <div className="box-info-link"><a href="#">Total Revenue<ArrowRightAltIcon/></a></div>
        </div>
        
      </Tooltip>
      
      
    </div>
    
  );
 }
 if(Cookies.get("role") == "shop_m"){
  return (
    <div className="row admin_dashboard_card_container">
   

      {/* <Tooltip title="Total Users">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card1">
          <div className="dash-box-info">
            <SupervisorAccountIcon
              style={{ fontSize: "36px", color: "white" }}
            />
            <CountUp
              end={admin_dashboard_details.tot_sub_users}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link">
            <Link to="/show_sub_admin_list">Sub Users Info <ArrowRightAltIcon/></Link>
          </div>
        </div>
      </Tooltip> */}
      <Tooltip title="Total User Leads">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card2">
          <div className="dash-box-info">
            <FormatListBulletedIcon style={{ fontSize: "36px", color: "white" }} />
            <CountUp
              end={admin_dashboard_details.tot_user_leads}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
            </div>
            <div className="box-info-link">
              <Link to="/lead_listing">User Leads Info <ArrowRightAltIcon/></Link>
            </div>
        </div>
      </Tooltip>
      <Tooltip title="Total Orders">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card3">
          <div className="dash-box-info">
          <img src={tot_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            <CountUp
              end={admin_dashboard_details.tot_orders}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"><Link to="/get_shop_m_all_orders">Total Orders Info <ArrowRightAltIcon/></Link></div>
        </div>
      </Tooltip>
      {/* <Tooltip title="Users">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card4">
          <div className="dash-box-info">
            <CategoryIcon style={{ fontSize: "36px", color: "white" }} />
            <CountUp
              end={admin_dashboard_details.tot_zula_category}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"><a href="#">Zula Category Info <ArrowRightAltIcon/></a></div>
        </div>
        
      </Tooltip> */}
      
    </div>
    
  );
 }

 if(Cookies.get("role") == "factory_m"){
  return (
    <div className="row admin_dashboard_card_container">
   

      <Tooltip title="Total Order">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card1">
          <div className="dash-box-info">
          <img src={tot_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            {/* <SupervisorAccountIcon
              style={{ fontSize: "36px", color: "white" }}
            /> */}
            <CountUp
              end={admin_dashboard_details.tot_order}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link">
            <Link to="/show_factory_m_orders?show= ">Total Order Info <ArrowRightAltIcon/></Link>
          </div>
        </div>
      </Tooltip>
      <Tooltip title="Total Pending Order">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card2">
          <div className="dash-box-info">
          <img src={pending_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            <CountUp
              end={admin_dashboard_details.tot_pending_order}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
            </div>
            <div className="box-info-link">
              <Link to="/show_factory_m_orders?show=pending">Total Pending Order Info <ArrowRightAltIcon/></Link>
            </div>
        </div>
      </Tooltip>
      <Tooltip title="Total In Process Order">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card3">
          <div className="dash-box-info">
          <img src={in_process_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            <CountUp
              end={admin_dashboard_details.tot_processing_order}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"><a href="/show_factory_m_orders?show=in-process">Total In Process Order Info <ArrowRightAltIcon/></a></div>
        </div>
      </Tooltip>
      <Tooltip title="Total Deliverd Order">
        <div className="col-md-3 admin_dashboard_card admin_dashboard_card4">
          <div className="dash-box-info">
          <img src={deliverd_orders} alt="" style={{ width : "50px" , height : "50px" , color: "white" }}/>
            <CountUp
              end={admin_dashboard_details.tot_deliverd_order}
              style={{ fontSize: "36px", fontWeight: "500", color: "white" }}
            />
          </div>
          <div className="box-info-link"><a href="show_factory_m_orders?show=deliverd">Total Deliverd Order Info <ArrowRightAltIcon/></a></div>
        </div>
        
      </Tooltip>
      
    </div>
    
  );
 }
};



export default Admin_Dashboard;
