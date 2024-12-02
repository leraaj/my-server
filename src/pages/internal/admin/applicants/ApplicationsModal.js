import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import CustomTable from "../../../../components/table/CustomTable";
import useFetchById from "../../../../hooks/useFetchById";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";
import CustomButton from "../../../../components/button/CustomButton";
import ViewApplicationModal from "./ViewApplicationModal";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";

const ApplicationsModal = ({ show, onHide, isLoading, refresh, user }) => {
  const { API_URL } = useAuthContext();
  const {
    data: application,
    loading: applicationLoading,
    refresh: refreshApplications,
  } = useFetchById({
    path: "view-applications",
    id: user?.id,
  });
  const { data: countPending, refresh: refreshCountPending } = useFetchById({
    path: "countUnfinishedPending",
    id: user?.id,
  });
  const {
    data: countUnfinishedProgress,
    refresh: refreshCountUnfinishedProgress,
  } = useFetchById({
    path: "countUnfinishedProgress",
    id: user?.id,
  });
  const [applicationId, setApplicationId] = useState(null);
  const [filter, setFilter] = useState("Pending");

  const filteredData = useMemo(() => {
    if (!application || !Array.isArray(application)) return [];
    const formatDate = (timestamp) => {
      const { date, formattedTime } = dateTimeFormatter(timestamp);
      return { date, formattedTime };
    };
    return application
      .filter((app) => {
        if (filter === `Pending`) {
          return (
            app?.phase === 1 &&
            app?.applicationStatus === 1 &&
            app?.complete === 0
          );
        } else if (filter === "InProgress") {
          return (
            app?.phase === 1 &&
            app?.applicationStatus === 2 &&
            app?.complete === 0
          );
        } else if (filter === "Done") {
          return (
            app?.phase === 1 &&
            app?.applicationStatus === 2 &&
            app?.complete === 1
          );
        }
        return true;
      })
      .map((app) => ({
        id: app?._id,
        jobTitle: app?.job?.title,
        status: app?.applicationStatus,
        statusLabel:
          app?.phase === 1 &&
          app?.applicationStatus === 2 &&
          app?.complete === 1
            ? `Finalized`
            : app?.phase === 1 &&
              app?.applicationStatus === 1 &&
              app?.complete === 0
            ? `Application Under Review `
            : app?.phase === 1 &&
              app?.applicationStatus === 2 &&
              app?.complete === 0
            ? `Appointment Scheduling in Progress`
            : `Null`, // Handle other statuses if necessary
        appDetails: app,
        userDetails: app?.user,
        jobDetails: app?.job,
        createdAt: `${formatDate(app?.createdAt).date} - ${
          formatDate(app?.createdAt).formattedTime
        }`,
      }));
  }, [application, filter]);

  const columns = useMemo(
    () => [
      { accessorKey: "jobTitle", header: "Applied to" },
      { accessorKey: "statusLabel", header: "Status" },
      { accessorKey: "createdAt", header: "Date Created" },
    ],
    [application, filter]
  );

  const modalClose = () => {
    setFilter("Pending");
    onHide();
  };

  const [appViewModal, setAppViewModal] = useState(null);

  const showAppViewModal = () => {
    setAppViewModal(true);
  };

  const hideAppViewModal = () => {
    setAppViewModal(null);
  };

  const refreshData = () => {
    refreshApplications();
    refreshCountPending();
    refreshCountUnfinishedProgress();
    // Refresh Counters
    refresh();
  };
  return isLoading ? null : (
    <>
      <Modal
        show={show}
        onHide={modalClose}
        title={`${user?.fullName} - Application`}
        size="fullscreen">
        <CustomTable
          data={filteredData}
          columns={columns}
          enableLoading={applicationLoading}
          renderTopToolbarCustomActions={() => (
            <div className={"d-flex gap-2"}>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter == "Pending" ? "dark" : "outline-dark"
                }  `}
                onClick={() => {
                  refresh();
                  setFilter("Pending");
                }}>
                <span>Pending</span>{" "}
                {countPending?.count > 0 && (
                  <span class="badge text-bg-danger">
                    {countPending?.count}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter == "InProgress" ? "dark" : "outline-dark"
                }  `}
                onClick={() => {
                  refresh();
                  setFilter("InProgress");
                }}>
                <span>In Progress</span>{" "}
                {countUnfinishedProgress?.count > 0 && (
                  <span class="badge text-bg-danger">
                    {countUnfinishedProgress?.count}
                  </span>
                )}
              </button>
              <CustomButton
                size="sm"
                color={filter === "Done" ? "dark" : "outline-dark"}
                label="Done"
                onClick={() => setFilter("Done")}
              />
            </div>
          )}
          renderRowActions={({ row }) => (
            <div className={"d-flex gap-1"}>
              <CustomButton
                size="sm"
                color="dark"
                label="View"
                onClick={() => {
                  setApplicationId(row.original.id);
                  showAppViewModal();
                }}
              />
            </div>
          )}
        />
      </Modal>
      <ViewApplicationModal
        show={appViewModal}
        onHide={hideAppViewModal}
        id={applicationId}
        refresh={refreshData}
      />
    </>
  );
};

export default ApplicationsModal;
