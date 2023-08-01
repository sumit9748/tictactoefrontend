import React, { useContext, useState } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Header from "../header/Header";
import Topbar from "../topbar/Topbar";
import "./connect.css";
import boardStatus from "../data";
import { Link } from "react-router-dom";

const Connect = () => {
  const [email, setEmail] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const [board, setBoard] = useState(null);

  const connect = async () => {
    try {
      const res = await axiosInstance.get(`/auth/getuser/${email}`);
      
      callUser(res.data._id);
    } catch (err) {}
  };
  const callUser = async (id) => {
    try {
      const res = await axiosInstance.post("/board/", {
        users: [currentUser?._id, id],
        boardStatus: boardStatus,
      });
      setBoard(res.data._id);
      setErr("Board successfully created");
    } catch (err) {
      console.log(err);
      setErr(err.response.data);
    }
  };

  return (
    <div className="connect">
      <Topbar />
      <p style={{ fontFamily: "cursive" }}>Start a new Game</p>
      <Header info="Whom do you want to play with" />
      <div className="connectForm">
        <lable>Email</lable>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Provide email"
        />
      </div>
      {err && <div className="statusChecker">{err}</div>}
      <button onClick={connect}>Start Game</button>
      {board && (
        <Link to={{ pathname: "/games", state: board }}>
          <button className="prevBtn"> Go to Board</button>
        </Link>
      )}
    </div>
  );
};

export default Connect;
