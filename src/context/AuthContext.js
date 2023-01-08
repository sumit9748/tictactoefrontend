import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../config";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const history = useHistory();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const login = async (inputs) => {
    const res = await axiosInstance.post(`/auth/login`, inputs);

    setCurrentUser(res.data);
  };

  const logout = () => {
    localStorage.setItem("user", JSON.stringify(null));
    history.pushState("/login");
  };
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
