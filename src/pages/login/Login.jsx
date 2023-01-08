import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import Header from "../../components/header/Header";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { AuthContext } from "../../context/AuthContext";
import "./login.css";
const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const [err, setErr] = useState("");
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      history.push("/games");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="loginPage">
      <KeyboardArrowLeftIcon
        onClick={() => history.push("/")}
        className="arrow"
      />

      <form className="registerform">
        <p>login</p>
        <Header info={"Please enter your details"} />

        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Your username"
          onChange={(e) => handleChange(e)}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          onChange={(e) => handleChange(e)}
        />
        {err && <div className="statusChecker">{err}</div>}
        <button className="login" type="submit" onClick={handleClick}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
