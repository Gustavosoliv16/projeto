import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

 if(isAuthenticated)
  {
   return children;
 }

 return <Navigate to="/login" replace />;
}

export default PrivateRoute;