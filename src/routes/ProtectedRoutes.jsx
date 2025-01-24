import React, { useContext } from "react";
import { AuthContextAPI } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  let { authUser } = useContext(AuthContextAPI);
  if (
    (authUser && authUser?.accessToken) ||
    window.localStorage.getItem("TOKEN")
  ) {
    return children ;
  } else {
    return <Navigate to="/auth/login" />;
  }
};

export default ProtectedRoutes;
