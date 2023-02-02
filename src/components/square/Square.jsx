import React, { useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../../context/AuthContext";
const Square = ({ element, id, handleClick, friendId }) => {
  const [push, setPush] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // console.log(id);

  useEffect(() => {
    if (element === currentUser?._id) {
      setPush(
        <CloseIcon
          style={{ color: "blue", fontWeight: "bold", fontSize: "70px" }}
        />
      );
    } else if (element === friendId) {
      setPush(
        <CircleOutlinedIcon
          style={{ color: "red", fontWeight: "bold", fontSize: "70px" }}
        />
      );
    }
  }, [element, friendId, handleClick]);

  return (
    <div
      style={{
        display: "flex",
        width: "105px",
        height: "100px",
        alignItems: "center",
        justifyContent: "center",
        cursor: element === friendId ? "none" : "pointer",
        margin: "1px 1px",
      }}
      onClick={() => handleClick(id)}
    >
      {push}
    </div>
  );
};

export default Square;
