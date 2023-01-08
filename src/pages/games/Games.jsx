import Card from "../../components/card/Card";
import React, { useState } from "react";
import "./games.css";
import Header from "../../components/header/Header";
import NewGame from "../../components/newGame/NewGame";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "../../config";
import { useHistory } from "react-router";
const Games = () => {
  const { currentUser } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [err, setErr] = useState("");

  const history = useHistory();

  useEffect(() => {
    newGame();
  }, []);

  const newGame = async () => {
    try {
      const res = await axiosInstance.get(`/board/${currentUser?._id}`);
      setGames(
        res.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
      );
    } catch (err) {
      setErr(err.response.data ? err.response.data : "Something is wrong");
    }
  };
  return (
    <div className="game">
      <Header info={"Your Games"} />
      {games.map((g) => (
        <Card cardDetails={g} />
      ))}

      {games.length > 0 ? (
        <button
          className="newGameButton"
          onClick={() => history.push("/newGame")}
        >
          New Game
        </button>
      ) : (
        <NewGame />
      )}

      {err && <div className="statusChecker">{err}</div>}
    </div>
  );
};

export default Games;
