import React from "react";

const SubmitButton = ({ isLoading }) => {
  return (
    <button
      type="submit"
      className={`btn btn-sm btn-dark`}
      disabled={isLoading}>
      {isLoading ? (
        <div className="d-flex align-items-center">
          <span>
            Save changes{" "}
            <div className="spinner-border spinner-border-sm" role="status" />
          </span>
        </div>
      ) : (
        "Save changes"
      )}
    </button>
  );
};

export default SubmitButton;
