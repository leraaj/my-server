import React, { useEffect, useState } from "react";
import "../../styles/navbar.css";
import useToggle from "../../hooks/useToggle";
import Brand from "../../assets/images/brand/darkshot-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
const Navbar = () => {
  const { toggle, toggler } = useToggle();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const landingLinks = [
    { name: "home" },
    { name: "services" },
    { name: "projects" },
    { name: "about" },
    { name: "career" },
    { name: "contact" },
  ];
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    landingLinks.forEach((link) => {
      const section = document.getElementById(link.name);
      if (section) {
        observer.observe(section);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <nav id="navbar" className="fixed-top">
      <Link className="navbar-brand " to="/">
        <img src={Brand} alt="Darkshot Production" height="30" />
      </Link>
      <button
        className={`btn-toggler ${toggle ? "primary-btn" : "secondary-btn"}`}
        onClick={toggler}>
        toggle
      </button>
      <div className={`list-stack ${toggle ? "show" : ""}`}>
        {landingLinks.map((link, index) => {
          return (
            <ScrollLink
              key={index}
              onClick={toggler}
              duration={1000}
              className={`nav-link text-light ${
                activeSection == link.name
                  ? "text-opacity-100"
                  : "text-opacity-75"
              }`}
              to={`${link.name}`}>
              {link.name}
            </ScrollLink>
          );
        })}
        <div className="d-end">
          <button
            className="secondary-btn"
            onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Sign-In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

{
  /* 
  <Link className="navbar-brand border" to={"/"}>
    <img src={Brand} alt="Darkshot Production" height="30" />
  </Link> 
*/
}
