import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  
  const isAuthenticated = username === "fivlia" && password === "fivlia@123";

 
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
