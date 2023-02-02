import React from "react";
import Square from "../components/square/Square";

const Viewboard = ({ board, friendId }) => {
  return (
    <div className="box">
      {board?.map((bo) => (
        <div className="col">
          <Square element={bo?.userId} friendId={friendId} />
        </div>
      ))}
    </div>
  );
};

export default Viewboard;
