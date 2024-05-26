import React, { useState, useEffect } from "react";
import "./services.css";
import bg1 from "../../../../assets/images/services/services1_bg.jpg";
import bg2 from "../../../../assets/images/services/services2_bg.jpg";
import bg3 from "../../../../assets/images/services/services3_bg.jpg";

import cbg1_1 from "../../../../assets/images/services/services0_pic.jpg";
import cbg1_2 from "../../../../assets/images/services/services1_pic.jpg";
import cbg1_3 from "../../../../assets/images/services/services2_pic.jpg";

import cbg2_1 from "../../../../assets/images/services/services3_pic.jpg";
import cbg2_2 from "../../../../assets/images/services/services4_pic.jpg";
import cbg2_3 from "../../../../assets/images/services/services5_pic.jpg";

const Services = () => {
  // Define state variables to keep track of current image indexes
  const [bgIndex, setBgIndex] = useState(0);
  const [img1Index, setImg1Index] = useState(0);
  const [img2Index, setImg2Index] = useState(0);

  // Array of image URLs for each carousel item
  const bgImages = [bg1, bg2, bg3];
  const img1Images = [cbg1_1, cbg1_2, cbg1_3];
  const img2Images = [cbg2_1, cbg2_2, cbg2_3];
  const servicesTitle = [
    { id: "01", title: "event management" },
    { id: "02", title: "digital marketing" },
    { id: "03", title: "Model Photoshoot" },
  ];
  let intervalId;
  const updateIndexes = (index) => {
    clearInterval(intervalId);
    setBgIndex(index);
    setImg1Index(index);
    setImg2Index(index);
  };

  useEffect(() => {
    intervalId = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
      setImg1Index((prevIndex) => (prevIndex + 1) % img1Images.length);
      setImg2Index((prevIndex) => (prevIndex + 1) % img2Images.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  const handleButtonClick = (index) => {
    updateIndexes(index);
  };

  return (
    <div
      id="services"
      className={`landing-section carousel-bg`}
      style={{
        backgroundImage: `linear-gradient(
            rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 1) 95%
          ),
          url(${bgImages[bgIndex]})`,
        backgroundPosition: "90% 0%",
        objectFit: "cover",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
      <div
        className="  col-lg col-md col-sm-12"
        style={{ marginBottom: "5rem" }}>
        <div className="row mx-0" style={{ marginBottom: "5rem" }}>
          <span className="bar-title" style={{ paddingBottom: "3rem" }}>
            services we
            <br />
            offer now
          </span>

          <span style={{ paddingBottom: "1rem" }}>
            Our events Management team will plan and execute your events, from
            corporate occasions to large-scaleconcerts, and ensure that every
            aspect of the event is well taken case of. We take pride in our
            strong partnerships that different vendors, which allows us to
            secure the best deals for our clients.
          </span>
          <div className="col">
            <div className="btn-group">
              <button
                className={`cursor-pointer btn bg-light rounded-pill p-2 mx-1 ${
                  bgIndex == 0 && "bg-opacity-50"
                }`}
                style={{ width: bgIndex == 0 ? "2rem" : "" }}
                onClick={() => handleButtonClick(0)}
              />
              <button
                className={`cursor-pointer btn bg-light rounded-pill p-2 mx-1 ${
                  bgIndex == 1 && "bg-opacity-50"
                }`}
                style={{ width: bgIndex == 1 ? "2rem" : "" }}
                onClick={() => handleButtonClick(1)}
              />
              <button
                className={`cursor-pointer btn bg-light rounded-pill p-2 mx-1 ${
                  bgIndex == 2 && "bg-opacity-50"
                }`}
                style={{ width: bgIndex == 2 ? "2rem" : "" }}
                onClick={() => handleButtonClick(2)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="  col-lg col-md col-sm-12 row mx-0 justify-content-center"
        style={{ marginBottom: "5rem" }}>
        <span
          className="col-12 position-relative"
          style={{ marginBottom: "5rem" }}>
          <span className="carousel-number">{servicesTitle[img1Index].id}</span>
          <span className="carousel-title">
            {servicesTitle[img1Index].title}
          </span>
        </span>
        <div className="col-12   d-flex justify-content-center align-content-center gap-2">
          <span className={`carousel-img-1 img-${img1Index} mb-2 `}>
            <img
              className="carousel-images"
              style={{ objectFit: "cover" }}
              src={img1Images[img1Index]}
              alt={`slide ${img1Index + 1}`}
            />
          </span>
          <span className={`carousel-img-2 img-${img2Index} mt-2 `}>
            <img
              src={img2Images[img2Index]}
              className="carousel-images"
              style={{ objectFit: "cover" }}
              alt={`slide ${img2Index + 1}`}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Services;
