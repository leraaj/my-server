import React from "react";
import Modal from "../../../../components/modal/Modal";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";

const ViewProfileModal = ({ show, onHide, user }) => {
  const modalClose = () => {
    onHide();
  };
  return (
    <Modal show={show} onHide={modalClose} title={`Profile`} size="fullscreen">
      <div className="row mx-0 g-3">
        <div className="col row mx-0 g-3">
          <div className="input-container">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.fullName}
              readOnly
              disabled
            />
          </div>
          <div className="input-container col">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.email}
              readOnly
              disabled
            />
          </div>
          <div className="input-container col">
            <label className="form-label">Contact</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.contact}
              readOnly
              disabled
            />
          </div>
          <div className="input-container">
            <label className="form-label">Resume/CV</label>
            <div className="col-auto">
              <button type="button" className="btn btn-dark ">
                Download
              </button>
            </div>
          </div>
          <div className="input-container">
            <label className="form-label">Skills</label>
            <div className="row mx-0 gap-2 flex-wrap">
              <span className="btn btn-dark col-auto">1 skill</span>
              <span className="btn btn-dark col-auto">2 skill</span>
              <span className="btn btn-dark col-auto">3 skill</span>
              <span className="btn btn-dark col-auto">4 skill</span>
              <span className="btn btn-dark col-auto">5 skill</span>
              <span className="btn btn-dark col-auto">6 skill</span>
              <span className="btn btn-dark col-auto">7 skill</span>
              <span className="btn btn-dark col-auto">8 skill</span>
              <span className="btn btn-dark col-auto">9 skill</span>
              <span className="btn btn-dark col-auto">10 skill</span>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="input-container">
            <label className="form-label">Portfolio</label>
            <div className="col-12 row mx-0 g-2 overflow-auto">
              <img
                src={placeholder}
                style={{ height: "100px", width: "auto", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProfileModal;
