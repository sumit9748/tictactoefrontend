import React from "react";
import { useHistory } from "react-router-dom";
import Header from "../header/Header";
import "./newGame.css";
const NewGame = () => {
  const history = useHistory();
  return (
    <div className="newGame">
      <h1>No Games Found</h1>
      <button onClick={() => history.push("/newGame")}>Start a new Game</button>
    </div>
  );
};

export default NewGame;
