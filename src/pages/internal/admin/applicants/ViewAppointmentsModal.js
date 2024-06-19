import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";
import CustomButton from "../../../../components/button/CustomButton";
import { toast } from "sonner";

const ViewAppointmentsModal = ({ show, onHide, id, refresh }) => {
  const {
    data: appointment,
    loading: appointmentLoading,
    refresh: appointmentRefresh,
  } = useFetchById({
    path: "appointment",
    id: id,
  });
  const [showMeetingForms, setShowMeetingForms] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const user = appointment?.user;
  const job = appointment?.job;
  const status = appointment?.appointmentStatus;
  const phase = appointment?.phase;

  //   EVENTS
  const initialInterview = status === 2 && phase === 1;
  const finalInterview = status === 2 && phase === 2;
  const clientInterview = status === 2 && phase === 3;

  const createFinalInterview = async () => {
    let appointmentData = {
      appointmentStatus: 2,
      phase: 2,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${appointment?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(appointmentData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data); // Log the response from the API
        toast.success("Final interview created successfully.");
        modalClose();
      } else {
        toast.error(
          `Failed to create appointment: ${
            data.message || data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message || error}`);
    }
  };
  const createClientInterview = async () => {
    let appointmentData = {
      appointmentStatus: 2,
      phase: 3,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${appointment?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(appointmentData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data); // Log the response from the API
        toast.success("Final interview created successfully.");
        modalClose();
      } else {
        toast.error(
          `Failed to create appointment: ${
            data.message || data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message || error}`);
    }
  };

  const handleRejectAppointment = async (appointmentData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${appointment?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(appointmentData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data); // Log the response from the API
        toast.error(
          "Applicant has been rejected and will not be considered for future interviews."
        );
        modalClose();
      } else {
        toast.error(
          `Failed to reject applicant: ${
            data.message || data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message || error}`);
    } finally {
      modalClose();
    }
  };

  const resetInputs = () => {
    setShowMeetingForms(false);
    setRemarks();
    setMeetingTime();
    setMeetingLink();
  };
  const modalClose = () => {
    resetInputs();
    onHide();
  };
  return initialInterview ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Initial Screening`}
      size="md"
      isStatic={true}
      footer={
        <div className="d-flex gap-2">
          {showMeetingForms ? (
            <>
              <CustomButton
                color="secondary"
                label="Back"
                onClick={() => setShowMeetingForms(false)}
              />
              <CustomButton
                color="success"
                label="Schedule Final Interview"
                onClick={createFinalInterview}
                disabled={!remarks || !meetingLink || !meetingTime}
              />
            </>
          ) : (
            <>
              <CustomButton
                color="outline-danger"
                label="Reject"
                onClick={() =>
                  handleRejectAppointment({
                    remarks: remarks,
                    appointmentStatus: -1,
                    phase: 1,
                    typeOfRemark: "initial",
                  })
                }
                disabled={!remarks}
              />
              <CustomButton
                color="secondary"
                label="Proceed"
                onClick={() => setShowMeetingForms(true)}
                disabled={!remarks}
              />
            </>
          )}
        </div>
      }>
      <div className="row gap-3">
        {showMeetingForms ? (
          <>
            <div className="input-container">
              <label className="form-label">Meeting Date</label>
              <input
                type="datetime-local"
                className={`form-control form-control-light`}
                value={meetingTime || ""}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="text"
                className={`form-control form-control-light`}
                value={meetingLink || ""}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="input-container">
            <label className="form-label">Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={remarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  ) : finalInterview ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Final Interview`}
      size="md"
      isStatic={true}
      footer={
        <div className="d-flex gap-2">
          {showMeetingForms ? (
            <>
              <CustomButton
                color="secondary"
                label="Back"
                onClick={() => setShowMeetingForms(false)}
              />
              <CustomButton
                color="success"
                label="Schedule Final Interview"
                onClick={createClientInterview}
                disabled={!remarks || !meetingLink || !meetingTime}
              />
            </>
          ) : (
            <>
              <CustomButton
                color="outline-danger"
                label="Reject"
                onClick={createClientInterview}
                disabled={!remarks}
              />
              <CustomButton
                color="secondary"
                label="Proceed"
                onClick={() => setShowMeetingForms(true)}
                disabled={!remarks}
              />
            </>
          )}
        </div>
      }>
      <div className="row gap-3">
        {showMeetingForms ? (
          <>
            <div className="input-container">
              <label className="form-label">Meeting Date</label>
              <input
                type="datetime-local"
                className={`form-control form-control-light`}
                value={meetingTime || ""}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="text"
                className={`form-control form-control-light`}
                value={meetingLink || ""}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="input-container">
            <label className="form-label">Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={remarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  ) : clientInterview ? (
    <Modal
      show={show}
      onHide={modalClose}
      title={`Client Interview`}
      size="md"
      isStatic={true}
      footer={
        <div className="d-flex gap-2">
          {showMeetingForms ? (
            <>
              <CustomButton
                color="secondary"
                label="Back"
                onClick={() => setShowMeetingForms(false)}
              />
              <CustomButton
                color="success"
                label="Schedule Final Interview"
                onClick={createClientInterview}
                disabled={!remarks || !meetingLink || !meetingTime}
              />
            </>
          ) : (
            <>
              <CustomButton
                color="outline-danger"
                label="Reject"
                onClick={createClientInterview}
                disabled={!remarks}
              />
              <CustomButton
                color="secondary"
                label="Proceed"
                onClick={() => setShowMeetingForms(true)}
                disabled={!remarks}
              />
            </>
          )}
        </div>
      }>
      <div className="row gap-3">
        {showMeetingForms ? (
          <>
            <div className="input-container">
              <label className="form-label">Meeting Date</label>
              <input
                type="datetime-local"
                className={`form-control form-control-light`}
                value={meetingTime || ""}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="form-label">Meeting Time</label>
              <input
                type="text"
                className={`form-control form-control-light`}
                value={meetingLink || ""}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div className="input-container">
            <label className="form-label">Remarks</label>
            <textarea
              className={`form-control form-control-light`}
              value={remarks || ""}
              rows={4}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        )}
      </div>
    </Modal>
  ) : (
    appointment?.phase
  );
};

export default ViewAppointmentsModal;
