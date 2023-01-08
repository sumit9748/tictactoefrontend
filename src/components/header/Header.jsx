import React from "react";
import "./header.css";

const Header = ({ info }) => {
  return (
    <div className="header">
      <h1>{info}</h1>
    </div>
  );
};

export default Header;
