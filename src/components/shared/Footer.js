import React from "react";
import "../../styles/footerStyles.css";
import dsLogo from "../../assets/images/brand/darkshot-logo.png";
import { Link } from "react-router-dom";
import fbLogo from "../../assets/icons/fb.png";
import instagramLogo from "../../assets/icons/instagram.png";
import youtubeLogo from "../../assets/icons/youtube.png";
const Footer = () => {
  return (
    <footer className="col-12 ">
      <div className="col-12 row mx-0">
        <div className="col-12 col-md row gap-3 m-0 p-2 ">
          <div className="col-12">
            <img src={dsLogo} height={50} className="col-auto col-sm-auto" />
          </div>
          <div className="col-12">
            <span className="col-12 footer-description text-center text-sm-start">
              We are the media production company specializing events management
              and digital marketing.
            </span>
          </div>
        </div>
        <div className="col-12 col-md d-flex align-items-start pt-3 ">
          <div className="col-auto col-sm-auto row  mx-0 p-0">
            <span className="footer-title">Legal</span>
            <span className="footer-description">
              <Link style={{ textDecoration: "none", color: "white" }}>
                Terms and Conditions
              </Link>
              <br />
              <Link style={{ textDecoration: "none", color: "white" }}>
                Privacy Policy
              </Link>
            </span>
          </div>
          <div className="col-auto col-sm-auto row mx-0 p-0">
            <span className="footer-title ">discover us</span>
            <span>
              <div className="d-flex align-items-center gap-2 mx-0 p-0">
                <Link>
                  <img src={fbLogo} className="social-media-logo" />
                </Link>
                <Link>
                  <img src={instagramLogo} className="social-media-logo" />
                </Link>
                <Link>
                  <img src={youtubeLogo} className="social-media-logo" />
                </Link>
              </div>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
