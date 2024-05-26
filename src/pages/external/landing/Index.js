import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../../../components/layout/Navbar";
import Home from "./home/Home";
import "../../../styles/landingPage.css";
import Services from "./services/Services";
const Landing = () => {
  return (
    <>
      <Navbar />
      <Home />
      <Services />
      <div id="projects" className="landing-section">
        projects
      </div>
      <div id="about" className="landing-section">
        about
      </div>
      <div id="career" className="landing-section">
        career
      </div>
      <div id="contact" className="landing-section">
        contact
      </div>
    </>
  );
};

export default Landing;
