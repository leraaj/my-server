import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";
import CustomButton from "../../../../components/button/CustomButton";
import { toast } from "sonner";
import useFetch from "../../../../hooks/useFetch";

const ViewApplicationModal = ({ show, onHide, id, refresh }) => {
  const {
    data: application,
    loading: applicationLoading,
    refresh: applicationRefresh,
  } = useFetchById({
    path: "application",
    id: id,
  });
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const user = application?.user;
  const job = application?.job;
  const status = application?.applicationStatus;
  const hasPendingApplication = status === 1;
  const hasPendingAppointment = status === 2 && !application?.disabled;
  const appointmentCreated = status === 2 && application?.disabled;

  const { refresh: applicationsRefresh } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/applications`
  );
  const { refresh: appointmentsRefresh } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/appointments`
  );

  const handleMeetingLink = (e) => {
    setMeetingLink(e.target.value);
  };

  const handleMeetingTime = (e) => {
    setMeetingTime(e.target.value);
  };

  const handleUserApplication = async (data) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/application/${application?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success("Application request handled successfully.");
        refreshData();
        onHide();
      } else {
        toast.error("Failed to handle application request.");
      }
    } catch (error) {
      toast.error("An error occurred while handling application request.");
    }
  };

  const handleUserAppointment = async (userId, jobId) => {
    const appointmentData = {
      userId: userId,
      jobId: jobId,
      meetingLink: meetingLink,
      meetingTime: meetingTime,
    };
    try {
      const applicationResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/application/${application?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            disabled: true,
          }),
        }
      );
      if (applicationResponse.ok) {
        try {
          const appointmentResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/appointment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify(appointmentData),
            }
          );

          const fnResponse = await appointmentResponse.json();
          console.log(fnResponse); // Log the response from the API

          if (appointmentResponse.ok) {
            toast.success("Appointment created successfully.");
            onHide();
            refreshData();
          } else {
            toast.error("Failed to create appointment.");
          }
        } catch (error) {
          toast.error("An error occurred while creating appointment.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while creating appointment.");
    }
  };

  const refreshData = () => {
    applicationRefresh();
    applicationsRefresh();
    appointmentsRefresh();
    refresh();
  };

  return (
    <>
      {applicationLoading ? null : hasPendingApplication ? (
        <Modal
          show={show}
          onHide={onHide}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md"
          footer={
            <>
              <CustomButton
                color="outline-danger"
                label="Decline"
                onClick={() => handleUserApplication({ applicationStatus: 0 })}
              />
              <CustomButton
                color="success"
                label="Accept"
                onClick={() => handleUserApplication({ applicationStatus: 2 })}
              />
            </>
          }>
          <p>
            {user?.fullName} is requesting to apply for the position of{" "}
            {job?.title}.
          </p>
        </Modal>
      ) : hasPendingAppointment ? (
        <Modal
          show={show}
          onHide={onHide}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md"
          footer={
            <CustomButton
              color="danger"
              label="Create an Appointment"
              disabled={!meetingLink || !meetingTime}
              onClick={() => {
                handleUserAppointment(user?._id, job?._id, false);
              }}
            />
          }>
          <div className="row mx-0 g-3">
            <div className="input-container">
              <label className="form-label">Meeting Link</label>
              <input
                type="text"
                className="form-control form-control-light"
                onChange={handleMeetingLink}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="datetime-local"
                className="form-control form-control-light"
                onChange={handleMeetingTime}
              />
            </div>
          </div>
        </Modal>
      ) : appointmentCreated ? (
        <Modal
          show={show}
          onHide={onHide}
          title={`Application: ${user?.fullName} for ${job?.title}`}
          size="md">
          <p>{user?.fullName} already has an appointment.</p>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default ViewApplicationModal;
