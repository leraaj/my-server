import React from "react";

const CustomButton = ({
  onClick,
  color,
  size,
  label,
  type,
  disabled,
  isLoading,
}) => {
  return (
    <button
      type={"button"}
      className={`btn btn-${color} btn-${size} text-nowrap`}
      {...((disabled || isLoading) && { disabled: true })}
      onClick={onClick}>
      {label}
    </button>
  );
};

export default CustomButton;
