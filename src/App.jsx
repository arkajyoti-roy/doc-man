// import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Display from "./Components/Display";

function App() {
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     try {
  //       const parsedUser = JSON.parse(storedUser);
  //       setUser(parsedUser);
  //     } catch (error) {
  //       console.error('Error parsing user from localStorage:', error);
  //     }
  //   } else {
  //     console.error('Error parsing user from localStorage:');
  //   }
  // }, []);
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route 
            path="/" 
            element={user ? <Navigate to="/display" /> : <Login />} 
          /> */}
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/display" element={<Display />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
