import "../../../styles/landingPage.css";
import Navbar from "../../../components/layout/Navbar";
import Home from "./home/Home";
import Services from "./services/Services";
import Projects from "./projects/Projects";
import About from "./about/About";
import Career from "./career/Career";
import Contact from "./contact/Contact";
import Footer from "../../../components/shared/Footer";
import { useEffect } from "react";
const Landing = () => {
  const fetchTest = () => {
    fetch(`${process.env.REACT_APP_API_URL}users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      sameSite: "None",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("Fetch error:", err));
  };
  useEffect(() => {
    fetchTest();
  }, []);

  return (
    <>
      <Navbar />
      <Home />
      <Services />
      <Projects />
      <About />
      <Career />
      <Contact />
      <Footer />
    </>
  );
};

export default Landing;
