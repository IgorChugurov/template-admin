import "./sidebar.scss";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";

const Sidebar = () => {
  const { darkMode, dispatchDarkMode } = useContext(DarkModeContext);
  const { dispatchUser } = useContext(AuthContext);

  const [openBar, setOpenBar] = useState(true);
  return (
    <div className="sidebar" style={openBar ? { marginLeft: "0px" } : { marginLeft: "-90px" }}>
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">CHIN admin</span>
        </Link>
        <MenuIcon
          className={openBar ? "menu-icon" : "menu-icon toggle-menu-icon"}
          onClick={() => setOpenBar(!openBar)}
        />
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <span>Dashboard</span>
            <DashboardIcon className="icon" />
          </li>
          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <span>Users</span>
              <PersonOutlineIcon className="icon" />
            </li>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <span>Products</span>
              <StoreIcon className="icon" />
            </li>
          </Link>
          <li>
            <span>Orders</span>
            <CreditCardIcon className="icon" />
          </li>
          <li>
            <span>Delivery</span>
            <LocalShippingIcon className="icon" />
          </li>
          <p className="title">USEFUL</p>
          <li>
            <span>Stats</span>
            <InsertChartIcon className="icon" />
          </li>
          <li>
            <span>Notifications</span>
            <NotificationsNoneIcon className="icon" />
          </li>
          <p className="title">SERVICE</p>
          <li>
            <span>System Health</span>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
          </li>
          <li>
            <span>Logs</span>
            <PsychologyOutlinedIcon className="icon" />
          </li>
          <li>
            <span>Settings</span>
            <SettingsApplicationsIcon className="icon" />
          </li>
          <p className="title">USER</p>
          <li>
            <span>Profile</span>
            <AccountCircleOutlinedIcon className="icon" />
          </li>
          <li onClick={() => dispatchUser({ type: "LOGOUT" })}>
            <span>Logout</span>
            <ExitToAppIcon className="icon" />
          </li>
          <p className="title">MODE</p>
          <li>
            <span>{darkMode ? "Dark" : "Ligth"}</span>
            {darkMode ? (
              <Brightness7Icon
                className="icon"
                onClick={() => dispatchDarkMode({ type: "TOGGLE" })}
              />
            ) : (
              <Brightness4Icon
                className="icon"
                onClick={() => dispatchDarkMode({ type: "TOGGLE" })}
              />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
