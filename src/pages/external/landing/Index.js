import "../../../styles/landingPage.css";
import Navbar from "../../../components/layout/Navbar";
import Home from "./home/Home";
import Services from "./services/Services";
import Projects from "./projects/Projects";
import About from "./about/About";
import Career from "./career/Career";
import Contact from "./contact/Contact";
import Footer from "../../../components/shared/Footer";
const Landing = () => {
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
