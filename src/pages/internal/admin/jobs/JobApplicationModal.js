import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import { getValue } from "@testing-library/user-event/dist/utils";
import CustomButton from "../../../../components/button/CustomButton";

const JobApplicationModal = ({ show, onHide, refresh }) => {
  const {
    data: applications,
    loading: applicationLoading,
    refresh: jobRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/applications`);
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [applicantsApplication, setAppointmentsApplication] = useState({});
  // Modal Varaiables
  const [applicantAppModal, setApplicantAppModal] = useState(null);
  const showApplicantAppModal = () => {
    setApplicantAppModal(true);
  };
  const hideApplicantAppModal = () => {
    setApplicantAppModal(false);
  };

  // Handle Application Status
  const handleUserApplication = async (updatedData) => {
    try {
      console.log("Data: " + JSON.stringify(updatedData));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/application/${applicantsApplication?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success(
          "Success: The request for application was successfully handled."
        );
        hideApplicantAppModal();
        jobRefresh();
        console.log("Response: " + JSON.stringify(fnResponse));
      } else {
        toast.success("Error: The request for application was un-successful.");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  // Create Appointment Variables
  const [meetingLink, setMeetingLink] = useState({});
  const [meetingTime, setMeetingTime] = useState({});
  // Handle Application Status
  const handleUserAppointment = async (updatedData) => {
    try {
      console.log("Data: " + JSON.stringify(updatedData));
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
        hideApplicantAppModal();
        jobRefresh();
        console.log("Response: " + JSON.stringify(fnResponse));
      } else {
        toast.success("Error: The request for application was un-successful.");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        title="Job Applications"
        size="fullscreen"
        isStatic>
        <div class="vstack gap-3">
          {applicationLoading
            ? "loading..."
            : applications?.map((app) => {
                return (
                  <div>
                    <CustomButton
                      size="sm"
                      color="dark"
                      label="View Application"
                      onClick={() => {
                        showApplicantAppModal();
                        setSelectedApplicant(app?.user);
                        setAppointmentsApplication(app);
                      }}
                    />
                    {`   ${app?.job.title} - ${app?.user?.fullName}`}
                  </div>
                );
              })}
        </div>
      </Modal>
      <Modal
        show={applicantAppModal}
        onHide={hideApplicantAppModal}
        title={`${selectedApplicant.fullName} - Appointment Form`}
        size="sm">
        <div className="row mx-0 g-3">
          <div className="col-12 input-container">
            <p>
              <strong>Name: </strong>
              {selectedApplicant.fullName}
            </p>
            <p>
              <strong>Applied for job: </strong>
              {applicantsApplication?.job?.title}
            </p>
            {applicantsApplication?.applicationStatus === 2 && (
              <div className="row mx-0 g-3">
                <div className="col-12">
                  <p>
                    <strong>Application Status: </strong>
                    {applicantsApplication?.applicationStatus}
                  </p>
                </div>
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
                    type="text"
                    className="form-control form-control-light"
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <CustomButton
                    color={"danger"}
                    label={"Create an Appointment"}
                    onClick={() => {
                      const updatedData = {
                        userId: selectedApplicant._id,
                        jobId: applicantsApplication.job?._id,
                        meetingLink: meetingLink,
                        meetingTime: meetingTime,
                      };
                      handleUserAppointment(updatedData);
                    }}
                  />
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2">
              {applicantsApplication?.applicationStatus === 1 && (
                <>
                  <CustomButton
                    color={"success"}
                    label={"Accept"}
                    onClick={() => {
                      handleUserApplication();
                      const updatedData = {
                        userId: selectedApplicant._id,
                        jobId: applicantsApplication.job?._id,
                        applicationStatus: 2,
                      };
                      handleUserApplication(updatedData);
                    }}
                  />
                  <CustomButton
                    color={"danger"}
                    label={"Decline"}
                    onClick={() => {
                      handleUserApplication();
                      const updatedData = {
                        userId: selectedApplicant._id,
                        jobId: applicantsApplication.job?._id,
                        applicationStatus: 0,
                      };
                      handleUserApplication(updatedData);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobApplicationModal;
