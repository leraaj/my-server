import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { toast } from "sonner";
import Logo from "../../assets/images/brand/darkshot-logo.png";
import LogoCollapsed from "../../assets/images/brand/darkshot-logo-collapsed.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { sidebarLinks } from "../layout/links";
import "./styles.css";
import "./sidebar.css";
import Sidebar from "./Sidebar";
const InternalLayout = () => {
  const API = `${process.env.REACT_APP_API_URL}/api/user/logout`;
  const [hasErrors, setHasErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch, toggler, toggle } = useAuthContext();
  const location = useLocation();
  const links =
    sidebarLinks.find((link) => link.position === user?.position)?.links || [];
  const handleLogout = async () => {
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        sameSite: "None",
      });
      const data = await response.json();
      if (response.ok) {
        toast("Log-out successfully");
        dispatch({ type: "LOGOUT", payload: {} });
        navigate("/login");
        console.table(data.user);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div id="layout">
        <Sidebar />
        <div id="content-container">
          <nav id="content-navbar">
            <span
              id="toggle-btn"
              onClick={() => {
                toggler();
                localStorage.setItem("toggleSidebar", toggle);
              }}>
              {toggle ? <MenuIcon /> : <MenuOpenIcon />}
            </span>
            <button
              className="nav-link"
              onClick={handleLogout}
              style={{ color: "var(--dark-40)" }}>
              Logout
            </button>
          </nav>
          <div id="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalLayout;
