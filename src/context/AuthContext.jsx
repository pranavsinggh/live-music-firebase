import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { __AUTH } from "../backend/firebase";
import toast from "react-hot-toast";

export const AuthContextAPI = createContext(null);

const AuthProvider = ({ children }) => {
  let [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(__AUTH, userInfo => {
      if (userInfo?.emailVerified && !userInfo?.isAnonymous) {
        setAuthUser(userInfo);
        window.localStorage.setItem("TOKEN", userInfo.accessToken);
      } else {
        window.localStorage.removeItem("TOKEN");
      }
    });
  }, []);

  return (
    <AuthContextAPI.Provider value={{ authUser }}>
      {children}
    </AuthContextAPI.Provider>
  );
};

export default AuthProvider;
