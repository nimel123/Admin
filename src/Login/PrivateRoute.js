import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  // Check if user is logged in (for demo, just check if username and password exist)
  const isAuthenticated = username === "admin" && password === "admin";

  // If authenticated, render child routes, else redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
