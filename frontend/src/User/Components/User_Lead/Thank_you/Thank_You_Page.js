import React from 'react';
import '../Thank_you/Thank_You_Page.css'
import logo1 from '../../User_Lead/Assets/logo1.PNG'
import Cookies from 'js-cookie'
const Thank_You_Page = () => {

  if(!Cookies.get("id")){
    setTimeout(() => {
      window.location.href = "https://thezulahouse.com/"
    }, 6000);
  }


  return (
    <body className='thank_you'>
    <div className="content">
      <div className="wrapper-1">
    <center><img src={logo1} width={150} height={150}/></center>
        <div className="wrapper-2">
          <h1 style={{fontSize:"6em"}}>Thank you !</h1><br/>
          <center>
          <p style={{ width:"86%" }}>Your inquiry has been successfully received. Our team is now processing your request and will get back to you shortly.</p>
          </center>
        </div>
        
      </div>
    </div>
    </body>

  );
}

export default Thank_You_Page;
