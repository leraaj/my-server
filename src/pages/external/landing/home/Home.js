import React, { lazy, useEffect, useState } from "react";
import "./home.css";
const Index = () => {
  return (
    <div id="home" className="landing-section">
      <div
        className="col-lg-8 col-12 row mx-0 gy-4"
        style={{ paddingBottom: "10rem" }}>
        <span className="home-title">
          Where dreams become cinematic masterpieces.
        </span>
        <div className="d-flex gap-1">
          <button className="secondary-btn">inquire now</button>
          <button className="primary-btn">learn more</button>
        </div>
      </div>
    </div>
  );
};

export default Index;
