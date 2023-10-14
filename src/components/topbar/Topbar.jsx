import React, { useContext } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import HomeIcon from "@mui/icons-material/Home";

const Topbar = ({ }) => {
  const history = useHistory();
  const { logout } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  return (
    <div
      style={{
        height: "50px",
        width: "90%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <KeyboardArrowLeftIcon
        style={{ color: "black", fontSize: "30px" }}
        onClick={() => history.push("/")}
      />
      <PowerSettingsNewIcon onClick={() => logout(history)} />

      <HomeIcon onClick={() => history.push("/games")} />

      <p
        style={{ fontFamily: "cursive" }}
      >{`Welcome ${currentUser?.username}`}</p>
    </div>
  );
};

export default Topbar;
