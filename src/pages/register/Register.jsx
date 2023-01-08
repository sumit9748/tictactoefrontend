import React, { useState } from "react";
import { useHistory } from "react-router";
import Header from "../../components/header/Header";
import { axiosInstance } from "../../config";
import "./register.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const history = useHistory();
  const [err, setErr] = useState("");
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    axiosInstance
      .post("/auth/register", inputs)
      .then((res) => {
        history.push("/login");
      })
      .catch((err) => {
        setErr(err.response.data);
      });
  };

  return (
    <div className="registerPage">
      <KeyboardArrowLeftIcon
        onClick={() => history.push("/")}
        className="arrow"
      />
      <form className="registerform">
        <p>create account</p>
        <Header info={"Lets get to know you better!"} />

        <label>Your Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          onChange={(e) => handleChange(e)}
        />
        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Your username"
          onChange={(e) => handleChange(e)}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          onChange={(e) => handleChange(e)}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Your Password"
          onChange={(e) => handleChange(e)}
        />
        {err && (
          <div className="statusChecker">
            <p>{err}</p>
          </div>
        )}
        <button className="register" type="submit" onClick={handleClick}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
