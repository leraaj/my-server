import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Hooks
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { sidebarLinks } from "./links";
// Assets
import Logo from "../../assets/images/brand/darkshot-logo.png";
import LogoCollapsed from "../../assets/images/brand/darkshot-logo-collapsed.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import { adminRoutes, employeeRoutes } from "../../routes";
const Sidebar = () => {
  const { user, toggle, toggler } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const links =
    sidebarLinks.find((link) => link.position === user?.position)?.links || [];
  const homeLink =
    user?.position == 1
      ? "/accounts"
      : user?.position == 2
      ? "/profile"
      : user?.position == 3
      ? "/profile"
      : "/";

  useEffect(() => {
    const position = user?.position;
    if (
      position === 1 &&
      adminRoutes.some((route) => route.path === location.pathname)
    ) {
      localStorage.setItem("url", location.pathname);
    } else if (
      position === 2 ||
      (position === 3 &&
        employeeRoutes.some((route) => route.path === location.pathname))
    ) {
      localStorage.setItem("url", location.pathname);
    }
  }, [location.pathname, user]);

  return (
    <div id={`sidebar`} className={`${toggle ? "close" : ""}`}>
      <div id="sidebar-header">
        <span
          style={{
            cursor: "pointer",
            pointerEvents: "none",
          }}
          onClick={() => {
            navigate(homeLink);
          }}>
          <img src={toggle ? LogoCollapsed : Logo} id="sidebar-logo" />
        </span>
      </div>
      <div id="sidebar-body">
        <ul>
          {links.map((link, index) => {
            return (
              <li
                key={index}
                onClick={() => localStorage.setItem("url", location.pathname)}>
                <Link className="btn btn-light d-flex" to={`${link.url}`}>
                  <span className="col-auto">{link.icon}</span>
                  <span
                    className={`col text-start fade ${
                      toggle ? "hide d-none" : "show"
                    }`}>
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div id="sidebar-footer"> </div>
    </div>
  );
};

export default Sidebar;
