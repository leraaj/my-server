import React from "react";
import "../../../../styles/aboutStyles.css";
import Team1 from "../../../../assets/images/team/person1.jpg";
import Team2 from "../../../../assets/images/team/person2.jpg";
import Team3 from "../../../../assets/images/team/person3.png";
const About = () => {
  return (
    <div id="about" className="landing-section">
      <div className="col pt-5">
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          About us:
          <br />
          meet our team
        </span>
      </div>
      <div className="teams-container row m-0 gap-3 justify-content-center align-items-center">
        <span className="teammate-container col-auto col-sm-auto col-md-auto col-lg-auto">
          <img src={Team1} className="teammate-photo" />
          <div className="teammate-details">
            <span className="teammate-label">francis batayola</span>
            <span className="teammate-position">production manager</span>
          </div>
        </span>
        <span className="teammate-container col-auto col-sm-auto col-md-auto col-lg-auto">
          <img src={Team2} className="teammate-photo" />
          <div className="teammate-details">
            <span className="teammate-label">MJ Lopez</span>
            <span className="teammate-position">Director</span>
          </div>
        </span>
        <span className="teammate-container col-auto col-sm-auto col-md-auto col-lg-auto">
          <img src={Team3} className="teammate-photo" />
          <div className="teammate-details">
            <span className="teammate-label">Trizzia jovie hiara tinte</span>
            <span className="teammate-position">art director</span>
          </div>
        </span>
      </div>
      <div className="col pt-5">
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          About us:
          <br />
          mission & vision
        </span>
        <div className="row mx-0 gap-2">
          <span>
            Our <strong>Mission</strong> is to be the premiere media production
            company that provides exceptional events and management and digital
            marketing services to our clients.
          </span>
          <span>
            We <strong>Envision</strong> a world where every event is a success
            and every business thrives with our digital marketing solutions. We
            strive with our digital marketing solutions. We strive to create
            memorable experiences and help businesses reach their full potential
            while maintaining the highest standards of professionalism and
            excellence.
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;
