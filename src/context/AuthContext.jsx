import { createContext } from "react";

export const AuthContextAPI = createContext(null);

const AuthProvider = ({ children }) => {
  return (
    <AuthContextAPI.Provider value={""}>{children}</AuthContextAPI.Provider>
  );
};

export default AuthProvider;
