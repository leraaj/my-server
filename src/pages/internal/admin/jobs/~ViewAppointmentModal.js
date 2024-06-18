import React from "react";
import Modal from "../../../../components/modal/Modal";
import CustomButton from "../../../../components/button/CustomButton";

const ViewAppointmentModal = ({ show, onHide, user, appointment }) => {
  const jobTitle = appointment?.job?.title;
  return (
    <Modal
      show={show}
      onHide={onHide}
      title={`Job Appointment - ${appointment?.statusLabel}`}
      size="lg"
      footer={
        <>
          <CustomButton
            color={"outline-danger"}
            label={"Decline"}
            onClick={() => {
              const data = {
                appointmentStatus: 0,
                phase: 0,
              };
            }}
          />
          <CustomButton
            color={"success"}
            label={"Proceed to the next Interview"}
            onClick={() => {
              const data = {};
            }}
          />
        </>
      }>
      <div className="row mx-0 g-3">
        <div className="col-12 input-container">
          <p>
            <strong>Name: </strong>
            {user.fullName}
          </p>
          <p>
            <strong>Applied for job: </strong>
            {appointment?.job?.title}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewAppointmentModal;
