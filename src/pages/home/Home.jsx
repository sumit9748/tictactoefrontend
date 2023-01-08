import React from "react";
import "./home.css";
import { useHistory } from "react-router";
const Home = () => {
  const history = useHistory();
  return (
    <div className="home">
      <h3>async</h3>
      <h1>tic tac toe</h1>

      <button className="login" onClick={() => history.push("/login")}>
        Login
      </button>

      <button className="register" onClick={() => history.push("/register")}>
        Register
      </button>
    </div>
  );
};

export default Home;
