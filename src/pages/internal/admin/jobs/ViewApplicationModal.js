import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import CustomButton from "../../../../components/button/CustomButton";
import { toast } from "sonner";
import useFetch from "../../../../hooks/useFetch";
import DefaultProfile from "../../../../assets/images/placeholder/Img_placeholder.jpg";
const ViewApplicationModal = ({ show, onHide, refresh, user, application }) => {
  const {
    data: appointments,
    loading: appointmentLoading,
    refresh: appointmentRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/appointments`);
  // Toggleable Details
  const [toggle, setToggle] = useState(false);
  // Create Appointment Variables
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  // Handle Application Status
  const [appId, setAppId] = useState(null);
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
        toast.success(
          "Success: The request for application was successfully handled."
        );
        onHide();
        refresh();
        appointmentRefresh();
        console.log("Response: " + JSON.stringify(fnResponse));
      } else {
        toast.error("Error: The request for application was unsuccessful.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Handle Application Status
  const handleUserAppointment = async (updatedData) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success(
          "Success: The request for appointment was successfully created"
        );
        onHide();
        refresh();
        console.log("Response: " + JSON.stringify(fnResponse));
      } else {
        toast.error("Error: The request for application was unsuccessful.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      title={`Job Application - ${application?.statusLabel}`}
      size="fullscreen"
      footer={
        application?.applicationStatus === 1 && (
          <>
            <CustomButton
              color={"outline-danger"}
              label={"Decline"}
              onClick={() => {
                const data = {
                  applicationStatus: 0,
                };
                handleUserApplication(data);
              }}
            />
            <CustomButton
              color={"success"}
              label={"Accept"}
              onClick={() => {
                const data = {
                  applicationStatus: 2,
                };
                handleUserApplication(data);
              }}
            />
          </>
        )
      }>
      <div className="row mx-0 g-3">
        <div
          className="col-12 col-md col-lg   overflow-auto"
          style={{ height: "calc(100dvh - calc(100dvh / 30%))" }}>
          <nav
            className="navbar d-flex justify-content-start gap-2 sticky-top shadow-sm px-2"
            style={{ backgroundColor: "var(--light-100)" }}>
            <CustomButton
              color={`${toggle === false ? "dark" : "outline-dark"}`}
              onClick={() => setToggle(false)}
              label="
              Job Details"
            />{" "}
            <CustomButton
              color={`${toggle === true ? "dark" : "outline-dark"}`}
              onClick={() => setToggle(true)}
              label="
            Applicant's Profile"
            />
          </nav>
          <div className="content ">
            {toggle ? (
              <div className="profile-container row mx-0 py-3 g-3">
                <div className="input-container col-12 col-md-12">
                  <label className="form-label">Full Name</label>
                  <input
                    type="email"
                    className="form-control form-control-light"
                    value={user?.fullName}
                    disabled
                    readOnly
                  />
                </div>
                <div className="input-container col-12 col-md">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-light"
                    value={user?.email}
                    disabled
                    readOnly
                  />
                </div>
                <div className="input-container col-12 col-md">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="number"
                    className="form-control form-control-light"
                    value={user?.contact}
                    disabled
                    readOnly
                  />
                </div>
                <div className="input-container col-12 col-md-12">
                  <label className="form-label">Resume/CV</label>
                  <div className="col-auto">
                    <a className="btn btn-dark" download={"#"}>
                      Download
                    </a>
                  </div>
                </div>
                <div className="input-container col-12">
                  <label className="form-label">Portfolio</label>
                  <div className="col-auto">
                    <CustomButton color="dark" label="View portfolio" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="job-container row mx-0 py-3 g-3">
                <h5
                  style={{
                    fontFamily: "Poppins-Bold",
                    textTransform: "uppercase",
                  }}>
                  {application?.job?.title}
                </h5>
                <div className="col card card-body ">
                  <div className="row mx-0 g-2">
                    <h6
                      style={{
                        fontFamily: "Poppins-Bold",
                        textTransform: "uppercase",
                      }}>
                      Benefits
                    </h6>
                    <div className="input-group">
                      <span className="input-group-text">Pay</span>
                      <textarea
                        className="form-control form-control-light"
                        defaultValue={application?.job?.details?.benefits?.pay}
                        rows={1}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="input-group">
                      <span className="input-group-text">Schedule</span>
                      <textarea
                        className="form-control form-control-light"
                        defaultValue={
                          application?.job?.details?.benefits?.schedule
                        }
                        rows={1}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="col card card-body ">
                  <div className="row mx-0 g-2">
                    <h6
                      style={{
                        fontFamily: "Poppins-Bold",
                        textTransform: "uppercase",
                      }}>
                      Requirements
                    </h6>
                    <span className="mb-3">
                      {application?.job?.details?.requirements.map((val) => {
                        return <li>{val}</li>;
                      })}
                    </span>
                  </div>
                </div>
                <div className="col card card-body ">
                  <div className="row mx-0 g-2">
                    <h6
                      style={{
                        fontFamily: "Poppins-Bold",
                        textTransform: "uppercase",
                      }}>
                      Responsibilities
                    </h6>
                    <span className="mb-3">
                      {application?.job?.details?.responsibilities.map(
                        (val) => {
                          return <li>{val}</li>;
                        }
                      )}
                    </span>
                  </div>
                </div>
                {/* <h6
                  style={{
                    fontFamily: "Poppins-Bold",
                    textTransform: "uppercase",
                  }}>
                  Responsibilities
                </h6> 
                <span className="mb-3">
                  {application?.job?.details?.responsibilities.map((val) => {
                    return <li>{val}</li>;
                  })}
                </span>*/}
              </div>
            )}
          </div>
        </div>
        {application?.applicationStatus === 2 &&
          (application.disabled ? (
            <div className="col-12 col-md ">
              <p>You've already created an appointment for this application</p>
            </div>
          ) : (
            <div className="col-12 col-md ">
              <div className="d-flex justify-content-end gap-2">
                <div className="row mx-0 g-3">
                  <div className="col-12 input-container">
                    <label className="form-label">Meeting Link</label>
                    <input
                      type="text"
                      className="form-control form-control-light"
                      onChange={(e) => setMeetingLink(e.target.value)}
                    />
                  </div>
                  <div className="col-12 input-container">
                    <label className="form-label">Meeting Time</label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-light"
                      onChange={(e) => setMeetingTime(e.target.value)}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <CustomButton
                      color={"danger"}
                      label={"Create an Appointment"}
                      disabled={application.disabled}
                      onClick={() => {
                        const updatedData = {
                          userId: user._id,
                          jobId: application.job?._id,
                          meetingLink: meetingLink,
                          meetingTime: meetingTime,
                          phase: null,
                          disabled: true,
                        };
                        handleUserAppointment(updatedData);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default ViewApplicationModal;
// {application?.applicationStatus === 2 &&
//   (application.disabled ? (
//     "You've already created an appointment for this application"
//   ) : (
//     <div className="d-flex justify-content-end gap-2">
//       <div className="row mx-0 g-3">
//         <div className="col-12 input-container">
//           <label className="form-label">Meeting Link</label>
//           <input
//             type="text"
//             className="form-control form-control-light"
//             onChange={(e) => setMeetingLink(e.target.value)}
//           />
//         </div>
//         <div className="col-12 input-container">
//           <label className="form-label">Meeting Time</label>
//           <input
//             type="datetime-local"
//             className="form-control form-control-light"
//             onChange={(e) => setMeetingTime(e.target.value)}
//           />
//         </div>
//         <div className="col-12 d-flex justify-content-end">
//           <CustomButton
//             color={"danger"}
//             label={"Create an Appointment"}
//             disabled={application.disabled}
//             onClick={() => {
//               const updatedData = {
//                 userId: user._id,
//                 jobId: application.job?._id,
//                 meetingLink: meetingLink,
//                 meetingTime: meetingTime,
//                 phase: null,
//                 disabled: true,
//               };
//               handleUserAppointment(updatedData);
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   ))}
{
  /* <div className="profile-container">
  <div className="input-container col">
    <label className="form-label">Email</label>
    <input
      type="email"
      className="form-control form-control-light"
      value={user?.email}
      disabled
      readOnly
    />
  </div>
  <div className="input-container col">
    <label className="form-label">Contact Number</label>
    <input
      type="number"
      className="form-control form-control-light"
      value={user?.contact}
      disabled
      readOnly
    />
  </div>
  <div className="input-container col-12">
    <label className="form-label">Resume/CV</label>
    <input
      type="number"
      className="form-control form-control-light"
      value={user?.contact}
      disabled
      readOnly
    />
  </div>
  <div className="input-container col-12">
    <label className="form-label">Portfolio</label>
    <input
      type="number"
      className="form-control form-control-light"
      value={user?.contact}
      disabled
      readOnly
    />
  </div>
</div>; */
}
{
  /* <div className="job-container">
  <h6
    className="mb-3"
    style={{
      fontFamily: "Poppins-Bold",
      textTransform: "uppercase",
    }}>
    Applicant
  </h6>
  <div className="profile mb-3 d-flex align-items-center g-3 mx-0">
    <img
      src={DefaultProfile}
      alt="applicant image"
      style={{
        height: "80px",
        width: "80px",
        objectFit: "cover",
        backgroundColor: "#e0e0e0",
        borderRadius: "2.5rem",
        border: "1px #e0e0e0 solid",
      }}
    />
    <div className="input-container col">
      <label className="form-label">Full name</label>
      <input
        type="text"
        className="form-control form-control-light"
        value={user?.fullName}
        disabled
        readOnly
      />
    </div>
  </div>
</div>; */
}
