// import logo from './logo.svg';
// import './App.css';
// import User_Lead from './User/Components/User_Lead/User_Lead';
// import { Route, Routes } from 'react-router-dom';
// import Login from './Admin/Components/Login/Login';
// import { ToastContainer } from 'react-toastify';
// import "react-toastify/dist/ReactToastify.css";
// import Listing from './Admin/Components/Listing/Listing';
// import Thank_You_Page from './User/Components/User_Lead/Thank_you/Thank_You_Page';
// import Cookies from 'js-cookie';
// import SideNav from './Admin/Components/SideNav/SideNav';
// import { useEffect } from 'react';
// import Forget_Password from './Admin/Components/Login/Forget_Password';

// function App() {
 
//   const url = new URL(window.location.href)
//   const url_pathname = url.pathname
//   // console.log(url.pathname)

//   if(Cookies.get('id')){
//     return (
//       <div className="App">
//           {/* <Login/> */}
//         <ToastContainer />
//         {url_pathname !== "/" ? <SideNav/> :null}
//         {/* <SideNav/> */}
          
//           <Routes>
//               <Route path='/user_lead' element={<User_Lead/>}/>
//               <Route path='/thank_you' element={<Thank_You_Page/>}/>
//               <Route path='/' element={<Login/>}/>
//               {/* <Route path='/Listing' element={<Listing/>}/> */}
//               <Route path='/sidenav' element={<SideNav/>}/>
              

//           </Routes>
//       </div>
//     );
//   }
//   else{
//     const url = new URL(window.location.href)
//     const url_pathname = url.pathname
//     if(url_pathname !== "/" && url_pathname !== "/user_lead" && url_pathname !== "/thank_you" && url_pathname !== "/forget_password" ){
//       window.location.href = "/"
//     }
//     return (
//       <div className="App">
//           {/* <Login/> */}
//         <ToastContainer />
          
//           <Routes>
//               <Route path='/' element={<Login/>}/>
//               <Route path='/user_lead' element={<User_Lead/>}/>
//               <Route path='/thank_you' element={<Thank_You_Page/>}/>
//           <Route path="/forget_password" element={<Forget_Password />} />

              
  
//           </Routes>
//       </div>
//     );
//   }
// }

// export default App;



import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';
import User_Lead from './User/Components/User_Lead/User_Lead';
import Login from './Admin/Components/Login/Login';
import Thank_You_Page from './User/Components/User_Lead/Thank_you/Thank_You_Page';
import SideNav from './Admin/Components/SideNav/SideNav';
import Forget_Password from './Admin/Components/Login/Forget_Password';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const id = Cookies.get('id');
    if (id) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      // Redirect to login if not authenticated and trying to access protected routes
      if (!['/', '/user_lead', '/thank_you', '/forget_password'].includes(location.pathname)) {
        navigate('/');
      }
    }
  }, [location, navigate]);

  return (
    <div className="App">
      <ToastContainer />
      {authenticated && location.pathname !== '/' && <SideNav />}
      
      <Routes>
        <Route path='/user_lead' element={<User_Lead />} />
        <Route path='/thank_you' element={<Thank_You_Page />} />
        <Route path='/' element={<Login />} />
        <Route path='/forget_password' element={<Forget_Password />} />
      </Routes>
    </div>
  );
}

export default App;
