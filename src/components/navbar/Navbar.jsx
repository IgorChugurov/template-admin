import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ActionResultMessageContext } from "../../context/actionResultMessageContext";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect, useRef, ref } from "react";

import { ExitToAppOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatchUser } = useContext(AuthContext);
  const { actionResultMessage } = useContext(ActionResultMessageContext);
  const { darkMode, dispatchDarkMode } = useContext(DarkModeContext);
  const compRef = useRef(null);
  const compErrRef = useRef(null);
  useEffect(() => {
    if (compRef.current) {
      document.getElementById("successMessage").classList.add("successMessage-enter-active");
      setTimeout(function () {
        document.getElementById("successMessage").classList.remove("successMessage-enter-active");
      }, 3800);
    }
    if (compErrRef.current) {
      document.getElementById("errorMessage").classList.add("errorMessage-enter-active");
      setTimeout(function () {
        document.getElementById("errorMessage").classList.remove("errorMessage-enter-active");
      }, 3800);
    }
  }, [actionResultMessage, compRef, compErrRef]);

  const hadleBackToAdmin = (event) => {
    event.stopPropagation();
    dispatchUser({
      type: "LOGIN_SUCCESS",
      payload: JSON.parse(localStorage.getItem(`#{process.env.REACT_APP_STORAGE}-admin`)),
    });
    navigate("/");
    setTimeout(() => {
      localStorage.setItem(`#{process.env.REACT_APP_STORAGE}-admin`, JSON.stringify(null));
    }, 500);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        {/* <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div> */}
        {actionResultMessage === "success" && (
          <div className="successMessage" id="successMessage" ref={compRef}>
            Success
          </div>
        )}
        {actionResultMessage === "error" && (
          <div className="errorMessage" id="errorMessage" ref={compErrRef}>
            Error
          </div>
        )}

        {/* <div className="items">
          
          {user && user.fromAdmin && (
            <div className="item">
              <ExitToAppOutlined onClick={hadleBackToAdmin} style={{ cursor: "pointer" }} />
            </div>
          )}
          {user && (
            <div className="item">
              <Link to="/logs" style={{ textDecoration: "none" }}>
                <span>Logs</span>
              </Link>
            </div>
          )}
          {user && user.role && user.role === "admin" && (
            <div className="item">
              <Link to="/alllogs" style={{ textDecoration: "none" }}>
                <span>All Logs</span>
              </Link>
            </div>
          )}
          {user && user.role && user.role === "admin" && (
            <div className="item">
              <Link to="/users" style={{ textDecoration: "none" }}>
                <span>Users</span>
              </Link>
            </div>
          )}
          {user && (
            <div className="item">
              <span>{user.email}</span>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
