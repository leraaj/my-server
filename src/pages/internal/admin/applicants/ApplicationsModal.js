import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import CustomTable from "../../../../components/table/CustomTable";
import useFetchById from "../../../../hooks/useFetchById";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";
import CustomButton from "../../../../components/button/CustomButton";
import ViewApplicationModal from "./ViewApplicationModal";

const ApplicationsModal = ({ show, onHide, isLoading, refresh, user }) => {
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

    // Consider logging specific app objects if needed for debugging
    // console.log("applications:", application);

    const formatDate = (timestamp) => {
      const { date, formattedTime } = dateTimeFormatter(timestamp);
      return { date, formattedTime };
    };

    return application
      .filter((app) => {
        if (filter === "Pending") {
          return app?.applicationStatus === 1 && !app?.disabled;
        } else if (filter === "InProgress") {
          return app?.applicationStatus === 2 && !app?.disabled;
        } else if (filter === "Done") {
          return app?.applicationStatus === 2 && app?.disabled;
        }
        return true;
      })
      .map((app) => ({
        id: app?._id,
        jobTitle: app?.job?.title,
        status: app?.applicationStatus,
        statusLabel:
          app?.applicationStatus === 2 && !app?.disabled
            ? "Appointment Scheduling in Progress"
            : app?.applicationStatus === 2 || app?.disabled
            ? "Finalized"
            : app?.applicationStatus === 1 && !app?.disabled
            ? "Application Under Review"
            : "", // Handle other statuses if necessary
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
    refresh();
    onHide();
  };

  const [appViewModal, setAppViewModal] = useState(false);

  const showAppViewModal = () => {
    setAppViewModal(true);
  };

  const hideAppViewModal = () => {
    setAppViewModal(false);
  };

  useEffect(() => {
    refreshCountPending();
    refreshCountUnfinishedProgress();
  }, [applicationLoading]);

  return (
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
                } position-relative`}
                onClick={() => setFilter("Pending")}>
                Pending
                {countPending?.count > 0 && (
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {countPending?.count}
                  </span>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-${
                  filter == "InProgress" ? "dark" : "outline-dark"
                } position-relative`}
                onClick={() => setFilter("InProgress")}>
                In Progress
                {countUnfinishedProgress?.count > 0 && (
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
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
        refresh={refreshApplications}
      />
    </>
  );
};

export default ApplicationsModal;
