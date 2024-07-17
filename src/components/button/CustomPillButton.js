import { RemoveCircle } from "@mui/icons-material";
import React, { useState } from "react";
import AddCircle from "@mui/icons-material/AddCircleOutline";
import useToggle from "../../hooks/useToggle";

const CustomPillButton = ({ label, type, size, onClick = () => {} }) => {
  const { toggle, toggler, setToggle } = useToggle();

  const handleClick = () => {
    onClick();
  };
  return (
    <div className={`selected-pill col-${size || ""}`}>
      <span className={`pill border col-${size || ""}`}>
        <span className="pill-label">{label}</span>
        {type === "remove" ? (
          <button
            type="button"
            className={`pill-btn  danger `}
            onClick={handleClick}>
            <RemoveCircle
              fontSize="sm"
              style={{ color: "var(--color-light)" }}
            />
          </button>
        ) : (
          <button
            type="button"
            className={`pill-btn  success `}
            onClick={handleClick}>
            <AddCircle fontSize="sm" style={{ color: "var(--color-light)" }} />
          </button>
        )}
      </span>
    </div>
  );
};

export default CustomPillButton;
