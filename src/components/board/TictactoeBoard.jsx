import React from "react";
import Square from "../square/Square";
import Viewboard from "../../viewboard/Viewboard";
import "./board.css";
const TictactoeBoard = ({
  board,
  friendId,

  handleClick,
  playerboard,
  saveMatch,
}) => {
  return (
    <div>
      {board?.status === false ? (
        <div className="box">
          {playerboard?.map((b, id) => (
            <div className="col">
              <Square
                element={b.userId}
                id={id}
                handleClick={handleClick}
                friendId={friendId?._id}
              />
            </div>
          ))}
          <button className="goBack" onClick={() => saveMatch()}>
            Back to games
          </button>
        </div>
      ) : (
        <Viewboard board={playerboard} friendId={friendId?._id} />
        // <h1>Game Over</h1>
      )}
    </div>
  );
};

export default TictactoeBoard;
