import React, { useMemo, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import useFetchById from "../../../../hooks/useFetchById";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";
import CustomTable from "../../../../components/table/CustomTable";
import CustomButton from "../../../../components/button/CustomButton";
import ViewAppointmentsModal from "./ViewAppointmentsModal";

const AppointmentsModal = ({ show, onHide, isLoading, refresh, user }) => {
  const {
    data: appointment,
    loading: appointmentLoading,
    refresh: refreshAppointments,
  } = useFetchById({
    path: "view-appointments",
    id: user?.id,
  });

  const [appointmentId, setAppointmentId] = useState(null);
  const [filter, setFilter] = useState("Awaiting user response");

  const statusLabels = {
    awaitingUserResponse: "Awaiting user response",
    undergoingScreening: "Undergoing screening",
    settingUpFinalInterview: "Setting up final interview",
    teamIntroduction: "Client Interview",
    processComplete: "Process complete",
    failedAppointments: "Failed appointments",
  };

  const filteredData = useMemo(() => {
    if (!appointment || !Array.isArray(appointment)) return [];

    const formatDate = (timestamp) => {
      const { date, formattedTime } = dateTimeFormatter(timestamp);
      return { date, formattedTime };
    };

    const filterCriteria = {
      "Awaiting user response": (app) =>
        app?.appointmentStatus === 1 && app?.phase === 0,
      "Undergoing screening": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 1,
      "Setting up final interview": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 2,
      "Client Interview": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 3,
      "Process complete": (app) =>
        app?.appointmentStatus === 2 && app?.phase === 3,
      "Failed appointments": (app) => app?.appointmentStatus === -1,
    };

    return appointment
      .filter((app) => {
        console.log(`Filtering ${app.details} with filter ${filter}`);
        if (filter in filterCriteria) {
          return filterCriteria[filter](app);
        }
        return true;
      })
      .map((app) => ({
        id: app?._id,
        jobTitle: app?.job?.title,
        status: app?.appointmentStatus,
        statusLabel:
          app?.appointmentStatus === 1 && app?.phase === 0
            ? "Awaiting user response"
            : app?.appointmentStatus === 2 && app?.phase === 1
            ? "Undergoing screening"
            : app?.appointmentStatus === 2 && app?.phase === 2
            ? "Setting up final interview"
            : app?.appointmentStatus === 2 && app?.phase === 3
            ? "Client Interview"
            : app?.appointmentStatus === 2 && app?.phase === 3
            ? "Process complete"
            : app?.appointmentStatus === -1
            ? "Failed appointments"
            : null,
        appDetails: app,
        userDetails: app?.user,
        jobDetails: app?.job,
        createdAt: `${formatDate(app?.createdAt).date} - ${
          formatDate(app?.createdAt).formattedTime
        }`,
      }));
  }, [appointment, filter]);

  const columns = useMemo(
    () => [
      { accessorKey: "jobTitle", header: "Applied to" },
      { accessorKey: "statusLabel", header: "Status" },
      { accessorKey: "createdAt", header: "Date Created" },
    ],
    [appointment, filter]
  );

  const modalClose = () => {
    setFilter("Awaiting user response");
    refresh();
    onHide();
  };
  const [appmViewModal, setAppmViewModal] = useState(null);
  const showAppmViewModal = () => {
    setAppmViewModal(true);
  };
  const hideAppmViewModal = () => {
    setAppmViewModal(null);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={modalClose}
        title={`${user?.fullName} - Appointment`}
        size="fullscreen">
        <CustomTable
          data={filteredData}
          columns={columns}
          enableLoading={appointmentLoading}
          renderTopToolbarCustomActions={() => (
            <div className={"d-flex gap-2"}>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Awaiting user response" ? "dark" : "outline-dark"
                }`}
                onClick={() => setFilter("Awaiting user response")}>
                <span>Awaiting user response</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Undergoing screening" ? "dark" : "outline-dark"
                }`}
                onClick={() => setFilter("Undergoing screening")}>
                <span>Initial Screening</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Setting up final interview"
                    ? "dark"
                    : "outline-dark"
                }`}
                onClick={() => setFilter("Setting up final interview")}>
                <span>Final Interview</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Client Interview" ? "dark" : "outline-dark"
                }`}
                onClick={() => setFilter("Client Interview")}>
                <span>Client Interview</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Process complete" ? "dark" : "outline-dark"
                }`}
                onClick={() => setFilter("Process complete")}>
                <span>Done</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter === "Failed appointments" ? "dark" : "outline-dark"
                }`}
                onClick={() => setFilter("Failed appointments")}>
                <span>Failed appointments</span>
              </button>
            </div>
          )}
          renderRowActions={({ row }) => (
            <div className={"d-flex gap-1"}>
              <CustomButton
                size="sm"
                color="dark"
                label="View"
                onClick={() => {
                  setAppointmentId(row.original.id);
                  showAppmViewModal();
                  console.log(row.original.statusLabel);
                }}
              />
            </div>
          )}
        />
      </Modal>
      <ViewAppointmentsModal
        show={appmViewModal}
        onHide={hideAppmViewModal}
        id={appointmentId}
        refresh={refreshAppointments}
      />
    </>
  );
};

export default AppointmentsModal;
