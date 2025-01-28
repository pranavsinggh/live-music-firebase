import React, { useContext } from "react";
import { __AUTH } from "../../backend/firebase";
import toast from "react-hot-toast";
import { AuthContextAPI } from "../../context/AuthContext";
import { deleteUser } from "firebase/auth";

const Settings = () => {
  let { authUser } = useContext(AuthContextAPI);
  let deleteAccount = async () => {
    try {
      let c = confirm("Do you want to delete account");
      if (c) {
        console.log(c);
        await deleteUser(authUser);
        toast.success("Successfully deleted");
        window.location.assign("/auth/login");
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };
  return (
    <div>
      <button onClick={deleteAccount}>Delete account</button>
    </div>
  );
};

export default Settings;
