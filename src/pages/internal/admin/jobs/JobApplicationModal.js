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
import ViewApplicationModal from "./ViewApplicationModal";
import dateTimeFormatter from "../../../../hooks/dateTimeFormatter";

const JobApplicationModal = ({ show, onHide }) => {
  const {
    data: applications,
    loading: applicationLoading,
    refresh: applicationRefresh,
  } = useFetch(`${process.env.REACT_APP_API_URL}/api/applications`);
  // Handle row select
  const handleRowSelect = (appDetails) => {
    setApplicantsApplication({
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
    if (!applications) return []; // Return empty array if jobs or categories data is not available
    return applications
      .map((app) => ({
        id: app?._id,
        user: app?.user?.fullName,
        job: app?.job?.title,
        status: app?.applicationStatus,
        statusLabel:
          app?.applicationStatus === 2 && app?.disabled
            ? "Finalized"
            : app?.applicationStatus === 2
            ? "Appointment Scheduling in Progress"
            : app?.applicationStatus === 1
            ? "Application Under Review"
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
      {
        accessorKey: "createdAt", // Since the full name is directly accessible
        header: "Created at",
      },
    ],
    [applications]
  );
  // View applicants Application Modal DATA
  const [applicantAppModal, setApplicantAppModal] = useState(null);
  const showApplicantAppModal = () => {
    setApplicantAppModal(true);
  };
  const hideApplicantAppModal = () => {
    setApplicantAppModal(false);
  };
  useEffect(() => {
    applicationRefresh();
  }, [show]);
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [applicantsApplication, setApplicantsApplication] = useState({});
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
                  const appDetails = row.original;
                  showApplicantAppModal();
                  setSelectedApplicant(appDetails?.userDetails);
                  handleRowSelect(row.original);
                }}
              />
            </div>
          )}
        />
      </Modal>
      <ViewApplicationModal
        show={applicantAppModal}
        onHide={hideApplicantAppModal}
        refresh={applicationRefresh}
        user={selectedApplicant}
        application={applicantsApplication}
      />
    </>
  );
};

export default JobApplicationModal;
