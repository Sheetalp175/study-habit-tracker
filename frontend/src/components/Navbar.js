import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#282c34" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Register</Link>
      <Link to="/login" style={{ color: "white", marginRight: "15px" }}>Login</Link>
      <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
    </nav>
  );
};

export default Navbar;
