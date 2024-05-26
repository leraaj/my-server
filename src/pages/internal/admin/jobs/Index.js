import React, { useMemo, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import CustomTable from "../../../../components/table/CustomTable";
import { toast } from "sonner";
import CustomButton from "../../../../components/button/CustomButton";
import Modal from "../../../../components/modal/Modal";
import AddJobModal from "./AddJobModal";
import AddCategoryModal from "./AddCategoryModal";
const Jobs = () => {
  const API = `${process.env.REACT_APP_API_URL}/api/`;
  const {
    data: jobs,
    loading: jobsLoading,
    refresh: jobsRefresh,
  } = useFetch(`${API}jobs`);
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
              isModal
              label="Update"
              onClick={() => {
                const user = row.original;
                console.log(user);
              }}
            />
          </div>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <div className="d-flex gap-2">
              <CustomButton
                size="sm"
                color="dark"
                isModal
                label="Add job"
                onClick={showAddJobModal}
              />
            </div>
          </>
        )}
      />
      <AddJobModal
        show={addJobModal}
        onHide={hideAddJobModal}
        refresh={jobsRefresh}
      />
    </>
  );
};

export default Jobs;
