import React, { useContext, useState, useEffect } from "react";
import { AuthContextAPI } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { __DB } from "../backend/firebase";
import { Navigate } from "react-router-dom";
import Spinner from "../components/helpers/Spinner";
import toast from "react-hot-toast";

const AdminRoutes = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const { authUser } = useContext(AuthContextAPI);

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        if (authUser?.uid) {
          const adminRef = doc(__DB, "user_profile", authUser.uid);
          const adminRole = await getDoc(adminRef);

          setRole(adminRole.data().role);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchAdminUser();
  }, [authUser]);

  // While loading, display a loading message or spinner
  if (isLoading) {
    return (
      <div className="h-[700px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Redirect if not logged in
  if (!authUser?.uid && !window.localStorage.getItem("TOKEN")) {
    toast.error("You are not authorized for this");
    return <Navigate to="/auth/login" />;
  }

  // Redirect if user is not an admin
  if (role !== "admin") {
    toast.error("You are not authorized for this");
    return <Navigate to="/user/profile" />;
  }

  // Render children if user is an admin
  return <>{children}</>;
};

export default AdminRoutes;
