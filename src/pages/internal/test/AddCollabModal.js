import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import { useAuthContext } from "../../../hooks/context/useAuthContext";
import useFetch from "../../../hooks/useFetch";

const AddGroupModal = ({ show, onHide, refresh }) => {
  const { user, API_URL } = useAuthContext();
  const COLLABORATION_API = `${API_URL}/api/collaborator`;
  const client = user?._id;
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  const [errors, setErrors] = useState({
    title: null,
    selectedJob: null,
    selectedApplicants: null,
  });
  // Validations
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleJob = (e) => {
    setSelectedJob(e.target.value);
  };

  const { data: categoryData } = useFetch(`${API_URL}/api/categories`);
  const { data: applicants } = useFetch(`${API_URL}/api/applicants`);
  const { data: jobData } = useFetch(`${API_URL}/api/jobs`);

  // Create a count of applicants for each job
  const jobApplicantCounts = jobData?.map((job) => {
    const count = applicants?.filter(
      (applicant) => applicant.job && applicant.job._id === job._id
    ).length;
    return { ...job, applicantCount: count };
  });

  const filteredApplicants = Array.isArray(applicants)
    ? applicants?.filter((applicant) => applicant.job && applicant.job._id)
    : [];

  const onClose = () => {
    onHide();
    reset();
  };

  const handleSubmit = async () => {
    const data = {
      title: title,
      client: client,
      users: selectedApplicants,
      job: selectedJob,
    };
    if (title === "" || selectedApplicants.length <= 0 || selectedJob === "") {
      return;
    } else {
      console.log(data);
    }
    try {
      const response = await fetch(COLLABORATION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    setTitle("");
    setSelectedCategory("");
    setSelectedJob("");
    setSelectedApplicants([]);
  };
  useEffect(() => {
    setErrors({
      title: title === "" ? true : false,
      selectedJob: selectedJob === "" ? true : false,
      selectedApplicants: selectedApplicants.length == 0 ? true : false,
    });
  }, [title, selectedJob, selectedApplicants]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      title="Start a New Collaboration"
      onSubmit={handleSubmit}
      reset={reset}
      size={"fullscreen"}>
      <div className="row m-0 g-2">
        <section className="col-12 col-lg-12">
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className={`form-control form-control-light ${
                errors.title && "is-invalid"
              }`}
              onChange={handleTitle}
              required
            />
          </div>
          {/* JOB */}
          <div className="mb-3">
            <label className="form-label">Job</label>
            <div className="d-flex gap-2 col-12">
              <div className="col">
                <select
                  className={`form-control form-control-light `}
                  onChange={handleJob}
                  required>
                  <option value="">Select Job</option>
                  {jobApplicantCounts?.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        <section className="col-12 row m-0 p-0">
          {/* Selected Applicants */}
          <div className="col-12 mb-3">
            <label className={`form-label`}>
              Selected Applicants ({selectedApplicants.length})
            </label>
            <div className="hstack gap-2 px-2 overflow-auto pb-2">
              {selectedApplicants.length > 0 ? (
                selectedApplicants.map((id) => {
                  const applicant = applicants.find(
                    (app) => app.user._id === id
                  );
                  return applicant ? (
                    <div
                      className="col-auto border d-flex justify-content-between rounded-pill p-1"
                      key={id}>
                      <div className="col-auto row align-items-center p-0 m-0 gap-0">
                        <span className="col-auto">
                          {applicant.user.fullName}
                          {/* <span
                            className="col-auto text-muted "
                            style={{ fontSize: "0.8rem" }}>
                            {` (${applicant.job.title})`}
                          </span> */}
                        </span>
                      </div>
                      <div className="col-auto d-flex justify-content-center align-items-center ">
                        <button
                          className="btn btn-sm btn-danger col-auto rounded-pill"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedApplicants((prev) =>
                              prev.filter(
                                (appId) => appId !== applicant.user._id
                              )
                            );
                          }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <span>No applicants selected.</span>
              )}
            </div>
          </div>
          {/* Applicants Available */}
          <div className="col-12  mb-3">
            <label className="form-label">Applicants Available</label>
            <div className="vstack gap-2 px-2">
              {selectedJob === "" ? (
                <span>No applicants selected.</span>
              ) : (
                filteredApplicants.map((app) => {
                  const isSelected = selectedApplicants.includes(app.user._id);
                  return (
                    <div
                      className="d-flex justify-content-between align-items-center"
                      key={app.user._id}>
                      <span className="col-auto">
                        {app.user.fullName}
                        <span
                          className="col-auto text-muted "
                          style={{ fontSize: "0.8rem" }}>
                          {` (${app.job.title})`}
                        </span>
                      </span>
                      {!isSelected ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedApplicants((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== app.user._id)
                                : [app.user._id, ...prev]
                            );
                          }}>
                          Select
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill"
                          disabled>
                          Selected
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default AddGroupModal;
