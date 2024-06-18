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
import ViewAppointmentModal from "./ViewAppointmentModal";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";

const JobApplicationModal = ({ show, onHide, refresh }) => {
  const {
    data: appointments,
    loading: appointmentLoading,
    refresh: jobRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/appointments`);
  const [selectedAppointee, setSelectedAppointee] = useState({});
  const [applicantAppointments, setAppointmentsApplication] = useState({});
  const handleRowSelect = (appDetails) => {
    setAppointmentsApplication({
      ...appDetails.appDetails,
      statusLabel: appDetails.statusLabel,
    });
  };
  // Table Data
  const formatDate = (timestamp) => {
    const { date, formattedTime } = dateTimeFormatter(timestamp);
    return { date, formattedTime };
  };
  const data = useMemo(() => {
    if (!appointments) return []; // Return empty array if jobs or categories data is not available
    return appointments
      .map((app) => ({
        id: app?._id,
        user: app?.user?.fullName,
        job: app?.job?.title,
        status: app?.appointmentStatus,
        statusLabel:
          app?.appointmentStatus === 2 && app?.phase === 3
            ? "Finalized"
            : app?.appointmentStatus === 1 && app?.phase === 3
            ? "Collaboration Assessment"
            : app?.appointmentStatus === 1 && app?.phase === 2
            ? "Final Interview Assessment"
            : app?.appointmentStatus === 1 && app?.phase === 1
            ? "Initial Interview Assessment"
            : app?.appointmentStatus && app?.phase === 0
            ? "Applicant Declined"
            : app?.appointmentStatus === 1 && !app?.phase
            ? "Waiting for Applicants response"
            : "",
        appDetails: app,
        userDetails: app?.user,
        jobDetails: app?.job,
        createdAt: `${formatDate(app?.createdAt).date} - ${
          formatDate(app?.createdAt).formattedTime
        }`, // Example Format: 2024-06-10T12:14:33.675Z
      }))
      .sort((a, b) => {
        // Sort by status, placing "Completed" (status 2) below "Pending" (other statuses)
        if (a.status !== b.status) {
          return a.status === 2 ? 1 : -1;
        }
        // If status is the same, sort by createdAt
        return new Date(a.createdAt) - new Date(b.createdAt);
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
      {
        accessorKey: "createdAt", // Since the full name is directly accessible
        header: "Created at",
      },
    ],
    [appointments]
  );
  // Modal Varaiables
  const [appointmentAppModal, setAppointmentAppModal] = useState(null);
  const showAppointmentAppModal = () => {
    setAppointmentAppModal(true);
  };
  const hideAppointmentAppModal = () => {
    setAppointmentAppModal(false);
  };
  // Handle Appointment Status
  const handleUserApplication = async (updatedData) => {
    try {
      console.log("Data: " + JSON.stringify(updatedData));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${applicantAppointments?._id}`,
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
        hideAppointmentAppModal();
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
  // Handle Appointment Status
  const handleUserAppointment = async (data) => {
    try {
      console.log("Data: " + JSON.stringify(data));
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointment/${selectedAppointee?._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success(
          "Success: The request for appointment was successfully created"
        );
        hideAppointmentAppModal();
        jobRefresh();
        console.log("Response: " + JSON.stringify(fnResponse));
      } else {
        toast.success("Error: The request for appointment was un-successful.");
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
                label="View Appointment"
                onClick={() => {
                  const appointment = row.original;
                  showAppointmentAppModal();
                  setSelectedAppointee(appointment?.userDetails);
                  handleRowSelect(row.original);
                }}
              />
            </div>
          )}
        />
      </Modal>
      <ViewAppointmentModal
        show={appointmentAppModal}
        onHide={hideAppointmentAppModal}
        user={selectedAppointee}
        appointment={applicantAppointments}
      />
    </>
  );
};

export default JobApplicationModal;
