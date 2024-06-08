import React from "react";
import "../../styles/footerStyles.css";
import dsLogo from "../../assets/images/brand/darkshot-logo.png";
import { Link } from "react-router-dom";
import fbLogo from "../../assets/icons/fb.png";
import instagramLogo from "../../assets/icons/instagram.png";
import youtubeLogo from "../../assets/icons/youtube.png";
const Footer = () => {
  return (
    <footer className="col-12 overflow-auto">
      <div className="col-12 col-lg row mx-0">
        <div className="col-12 pb-4">
          <img src={dsLogo} height={50} className="footer-logo" />
        </div>
        <span className="col footer-description">
          We are the media production company specializing events management and
          digital marketing.
        </span>
      </div>
      <div className="col-12 col-lg row mx-0">
        <div className="col row mx-0">
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
      </div>
      <div className="col-12 col-lg row mx-0">
        <div className="col row mx-0">
          <span className="footer-title">discover us</span>
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
    </footer>
  );
};

export default Footer;
