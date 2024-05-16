import React from "react";

const LoadingPage = () => {
  return (
    <div
      className="bg-dark d-flex justify-content-center align-items-center"
      style={{ height: "100dvh", width: "100%" }}>
      <span className="text-light d-flex align-items-center">
        <h1 className="fw-medium text-uppercase">Loading </h1>
      </span>
    </div>
  );
};

export default LoadingPage;
