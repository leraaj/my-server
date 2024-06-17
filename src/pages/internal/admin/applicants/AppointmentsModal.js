import React, { useMemo } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";

const ViewAppointmentModal = ({ show, onHide, isLoading, user }) => {
  // const { data, loading } = useFetchById({
  //   path: "view-appointments",
  //   id: user?.id,
  // });
  return (
    <Modal
      show={show}
      onHide={onHide}
      isLoading={isLoading}
      title={`${user?.fullName} - Appointment`}
      size="fullscreen">
      {/* {JSON.stringify(data)} */}
    </Modal>
  );
};

export default ViewAppointmentModal;
