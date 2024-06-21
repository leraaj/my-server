import React from "react";
import Modal from "../../../../components/modal/Modal";

const ViewProfileModal = ({ show, onHide, user }) => {
  const modalClose = () => {
    onHide();
  };
  return (
    <Modal show={show} onHide={modalClose} title={`Profile`} size="md">
      <div className="row mx-0 g-3 pb-3">
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
          <div className="input-container ">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.email}
              readOnly
              disabled
            />
          </div>
          <div className="input-container ">
            <label className="form-label">Contact</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.contact}
              readOnly
              disabled
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProfileModal;
