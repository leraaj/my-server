import React, { useMemo, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import CustomTable from "../../../../components/table/CustomTable";
import CustomButton from "../../../../components/button/CustomButton";
import AddJobModal from "./AddJobModal";
import ViewJobModal from "./UpdateJobModal";
import JobAppointmentModal from "./JobAppointmentModal";
import JobApplicationModal from "./JobApplicationModal";
const Jobs = () => {
  const API = `${process.env.REACT_APP_API_URL}/api/`;
  const [selectedJob, setSelectedJob] = useState({});
  const {
    data: jobs,
    loading: jobsLoading,
    refresh: jobsRefresh,
  } = useFetch(`${API}jobs`);
  const {
    data: application,
    loading: applicationLoading,
    refresh: applicationRefresh,
  } = useFetch(`${API}applications`);
  const {
    data: appointment,
    loading: appointmentLoading,
    refresh: appointmentRefresh,
  } = useFetch(`${API}appointments`);
  const data = useMemo(() => {
    if (!jobs) return []; // Return empty array if jobs or categories data is not available
    return jobs.map((job) => {
      return {
        id: job?._id,
        title: job?.title,
        categoryId: job?.category?._id,
        categoryTitle: job?.category?.title,
        benefitsPay: job?.details?.benefits?.pay,
        benefitsSchedule: job?.details?.benefits?.schedule,
        why: job?.details?.why,
        what: job?.details?.what,
        requirements: job?.details?.requirements,
        responsibilities: job?.details?.responsibilities,
      };
    });
  }, [jobs]);
  const uniqueCategories = useMemo(() => {
    if (!jobs) return [];
    const categories = jobs?.map((job) => job?.category?.title).filter(Boolean);
    return [...new Set(categories)];
  }, [jobs]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "title", // Since the full name is directly accessible
        header: "Job Title",
      },
      {
        accessorKey: "categoryTitle", // Since the full name is directly accessible
        header: "Category",
        filterVariant: "multi-select",
        filterSelectOptions: uniqueCategories,
      },
      {
        accessorKey: "benefitsPay",
        header: "Pay",
      },
    ],
    [uniqueCategories]
  );
  // ADD JOB MODAL VARIABLES
  const [addJobModal, setAddJobModal] = useState(null);
  const showAddJobModal = () => {
    setAddJobModal(true);
  };
  const hideAddJobModal = () => {
    setAddJobModal(false);
  };
  // VIEW JOB MODAL VARIABLES
  const [jobModal, setJobModal] = useState(null);
  const showJobModal = () => {
    setJobModal(true);
  };
  const hideJobModal = () => {
    setJobModal(false);
  };
  // VIEW JOB APPOINTMENT MODAL VARIABLES
  const [appointmentModal, setAppointmentModal] = useState(null);
  const showAppointmentModal = () => {
    setAppointmentModal(true);
  };
  const hideAppointmentModal = () => {
    setAppointmentModal(false);
  }; // VIEW JOB APPLICATION MODAL VARIABLES
  const [applicationModal, setApplicationModal] = useState(null);
  const showApplicationModal = () => {
    setApplicationModal(true);
  };
  const hideApplicationModal = () => {
    setApplicationModal(false);
  };
  return (
    <>
      <CustomTable
        data={data}
        columns={columns}
        enableLoading={jobsLoading}
        renderRowActions={({ row }) => (
          <div className={"d-flex gap-1"}>
            <CustomButton
              size="sm"
              color="dark"
              label="View"
              onClick={() => {
                const job = row.original;
                setSelectedJob(job);
                showJobModal();
              }}
            />
          </div>
        )}
        renderTopToolbarCustomActions={() => (
          <div className="d-flex align-items-center gap-2">
            <CustomButton
              size="sm"
              color="dark"
              isModal
              label="Add job"
              onClick={showAddJobModal}
            />
            <CustomButton
              size="sm"
              color="dark"
              label="Applications"
              onClick={() => {
                showApplicationModal();
                applicationRefresh();
              }}
            />
            <CustomButton
              size="sm"
              color="dark"
              label="Appointments"
              onClick={() => {
                showAppointmentModal();
                appointmentRefresh();
              }}
            />
          </div>
        )}
      />
      <AddJobModal
        show={addJobModal}
        onHide={hideAddJobModal}
        refresh={jobsRefresh}
      />
      <ViewJobModal
        show={jobModal}
        onHide={hideJobModal}
        refresh={jobsRefresh}
        selectedJob={selectedJob}
      />
      <JobApplicationModal
        show={applicationModal}
        onHide={hideApplicationModal}
        refresh={applicationRefresh}
      />
      <JobAppointmentModal
        show={appointmentModal}
        onHide={hideAppointmentModal}
        refresh={appointmentRefresh}
      />
    </>
  );
};

export default Jobs;
