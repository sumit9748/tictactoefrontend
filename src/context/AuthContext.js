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
  const login = async (inputs, setErr) => {
    try {
      const res = await axiosInstance.post(`/auth/login`, inputs);
      setCurrentUser(res.data);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  const logout = () => {
    localStorage.setItem("user", JSON.stringify(null));
    history.push("/login");
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
