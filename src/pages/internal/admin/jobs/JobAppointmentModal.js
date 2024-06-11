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
    refresh: jobRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/appointments`);
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [applicantAppointments, setAppointmentsApplication] = useState({});
  // Table Data
  const data = useMemo(() => {
    if (!appointments) return []; // Return empty array if jobs or categories data is not available
    return appointments.map((app) => {
      return {
        id: app?._id,
        user: app?.user?.fullName,
        job: app?.job?.title,
        appointmentStatus: app?.appointmentStatus,
        statusLabel: app?.appointmentStatus === 2 ? "Completed" : "Pending",
        userDetails: app?.user,
        appointmentDetails: app,
        jobDetails: app?.job,
      };
    });
  }, [appointments]);
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
    [appointments]
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
        `${process.env.REACT_APP_API_URL}/api/application/${applicantAppointments?._id}`,
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
        title="Job Appointments"
        size="fullscreen"
        isStatic>
        <CustomTable
          data={data}
          columns={columns}
          enableLoading={appointmentLoading}
          renderRowActions={({ row }) => (
            <div className={"d-flex gap-1"}>
              <CustomButton
                size="sm"
                color="dark"
                label="View Application"
                onClick={() => {
                  const appointment = row.original;
                  showApplicantAppModal();
                  setSelectedApplicant(appointment?.userDetails);
                  setAppointmentsApplication(appointment?.appointmentDetails);
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
              {applicantAppointments?.job?.title}
            </p>

            <div className="d-flex justify-content-end gap-2">
              {applicantAppointments?.appointmentStatus === 1 && (
                <>
                  <CustomButton
                    color={"success"}
                    label={"Accept"}
                    onClick={() => {
                      handleUserApplication();
                      const updatedData = {
                        userId: selectedApplicant._id,
                        jobId: applicantAppointments.job?._id,
                        appointmentStatus: 2,
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
                        jobId: applicantAppointments.job?._id,
                        appointmentStatus: 0,
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
