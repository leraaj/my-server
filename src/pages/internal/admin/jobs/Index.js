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
    error: jobsError,
  } = useFetch(`${API}jobs`);
  const {
    data: category,
    loading: categoryLoading,
    refresh: categoryRefresh,
    error: categoryError,
  } = useFetch(`${API}categories`);
  const data = useMemo(() => {
    if (!jobs) return []; // Return empty array if jobs data is not available

    return jobs.map((job) => {
      return {
        id: job?._id,
        title: job?.title, // Assuming job.fullName is the full name
        categoryId: job?.category._id, // Assuming job.fullName is the full name
        categoryTitle: job?.category.title, // Assuming job.fullName is the full name
        position: job?.position,
      };
    });
  }, [jobs]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "title", // Since the full name is directly accessible
        header: "Job Title",
      },
      {
        accessorKey: "categoryTitle", // Since the full name is directly accessible
        header: "Category Title",
      },
    ],
    []
  );
  // ADD JOB MODAL VARIABLES
  const [addJobModal, setAddJobModal] = useState(null);
  const showAddJobModal = () => {
    setAddJobModal(true);
  };
  const hideAddJobModal = () => {
    setAddJobModal(false);
  }; // ADD CATEGORY MODAL VARIABLES
  const [addCategoryModal, setAddCategoryModal] = useState(null);
  const showAddCategoryModal = () => {
    setAddCategoryModal(true);
  };
  const hideAddCategoryModal = () => {
    setAddCategoryModal(false);
  };
  return (
    <>
      <CustomTable
        data={data}
        columns={columns}
        enableLoading={jobsLoading}
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
              <CustomButton
                size="sm"
                color="dark"
                isModal
                label="Add category"
                onClick={showAddCategoryModal}
              />
            </div>
          </>
        )}
      />
      <AddJobModal show={addJobModal} onHide={hideAddJobModal} />
      <AddCategoryModal show={addCategoryModal} onHide={hideAddCategoryModal} />
    </>
  );
};

export default Jobs;
