import React from "react";

const Loader = ({ size }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%", width: "100%" }}>
      <div class={`spinner-border ${size == "sm" && "spinner-border-sm"}`} />
    </div>
  );
};

export default Loader;
