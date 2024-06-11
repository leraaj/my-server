import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import { getValue } from "@testing-library/user-event/dist/utils";
import CustomButton from "../../../../components/button/CustomButton";
import CustomTable from "../../../../components/table/CustomTable";

const JobApplicationModal = ({ show, onHide, refresh }) => {
  const {
    data: appointments,
    loading: appointmentLoading,
    refresh: appointmentRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/appointments`);
  const {
    data: applications,
    loading: applicationLoading,
    refresh: applicationRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/applications`);
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [applicantsApplication, setAppointmentsApplication] = useState({});
  // Table Data
  const data = useMemo(() => {
    if (!applications) return []; // Return empty array if jobs or categories data is not available
    return applications.map((app) => {
      return {
        id: app?._id,
        user: app?.user?.fullName,
        job: app?.job?.title,
        applicationStatus: app?.applicationStatus,
        statusLabel: app?.applicationStatus === 2 ? "Completed" : "Pending",
        userDetails: app?.user,
        applicationDetails: app,
        jobDetails: app?.job,
      };
    });
  }, [applications]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "user", // Since the full name is directly accessible
        header: "Applicants",
      },
      {
        accessorKey: "job", // Since the full name is directly accessible
        header: "Applied to",
      },
      {
        accessorKey: "statusLabel", // Since the full name is directly accessible
        header: "Status",
      },
    ],
    [applications]
  );
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
        applicationRefresh();
        appointmentRefresh();
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
        applicationRefresh();
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
        <CustomTable
          data={data}
          columns={columns}
          enableLoading={applicationLoading}
          renderRowActions={({ row }) => (
            <div className={"d-flex gap-1"}>
              <CustomButton
                size="sm"
                color="dark"
                label="View Application"
                onClick={() => {
                  const applicationDetails = row.original;
                  showApplicantAppModal();
                  setSelectedApplicant(applicationDetails?.userDetails);
                  setAppointmentsApplication(
                    applicationDetails?.applicationDetails
                  );
                }}
              />
            </div>
          )}
        />
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
            {applicantsApplication?.applicationStatus === 2 &&
              (applicantsApplication.disabled ? (
                "You've already created an appointment for this application"
              ) : (
                <div className="row mx-0 g-3">
                  <div className="col-12 input-container">
                    <label className="form-label">Meeting Link</label>
                    <input
                      type="text"
                      onClick={() => console.log(applicantsApplication)}
                      className="form-control form-control-light"
                      onChange={(e) => setMeetingLink(e.target.value)}
                    />
                  </div>
                  <div className="col-12 input-container">
                    <label className="form-label">Meeting Time</label>
                    <input
                      type="text"
                      className="form-control form-control-light"
                      onClick={() => console.log(applicantsApplication)}
                      onChange={(e) => setMeetingTime(e.target.value)}
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <CustomButton
                      color={"danger"}
                      label={"Create an Appointment"}
                      disabled={applicantsApplication.disabled}
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
              ))}

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
