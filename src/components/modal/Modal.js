import React, { useEffect, useRef } from "react";
import "./modal.css";

const Modal = ({
  show,
  onHide,
  title,
  children,
  onSubmit,
  reset,
  size,
  isStatic,
  isLoading,
}) => {
  const closeModal = () => {
    onHide();
  };
  const modalVisibility =
    show === null ? "d-none" : show ? "md-show" : "md-hide";
  const isTitleEmpty = title || "No Title";
  const modalSize =
    size == "fullscreen"
      ? "s-fullscreen"
      : size == "xl"
      ? "s-xl"
      : size == "lg"
      ? "s-lg"
      : size == "md"
      ? "s-md"
      : size == "sm"
      ? "s-sm"
      : "";
  return (
    <>
      <form
        id="md-form"
        className={`needs-validation`}
        noValidate
        onSubmit={onSubmit || null}>
        <div
          id="md-container"
          className={`${modalVisibility}`}
          onClick={!isStatic ? closeModal : null}>
          <div
            id="md"
            className={`${modalSize}`}
            onClick={(e) => e.stopPropagation()}>
            <div id="md-header">
              <span className={`${!title && "text-danger"}`}>
                {isTitleEmpty}
              </span>
              <span class="btn-close" aria-label="Close" onClick={closeModal} />
            </div>
            <div id="md-body">{children}</div>
            <div id="md-footer">
              <span>
                <button
                  type="reset"
                  className="btn btn-outline-dark"
                  onClick={closeModal}>
                  Cancel
                </button>
              </span>
              {onSubmit && (
                <span>
                  <button type="submit" className="btn btn-dark">
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm " />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Modal;
