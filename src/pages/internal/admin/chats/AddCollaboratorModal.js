import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import { toast } from "sonner";
import useFetch from "../../../../hooks/useFetch";
import CustomPillButton from "../../../../components/button/CustomPillButton";

const AddCollaboratorModal = ({ show, onHide, refreshCollaborators }) => {
  const { user } = useAuthContext();

  const [convoTitle, setConvoTitle] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [clients, setClients] = useState([]);
  const [uniqueJobs, setUniqueJobs] = useState([]);
  const [hiredApplicants, setHiredApplicants] = useState([]);
  const { data: applicants } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/applicants`
  );
  const { data: users } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/users`
  );

  useEffect(() => {
    if (users) {
      const filtered = users.filter((user) => user?.position === 2);
      setClients(filtered);
    }
  }, [users]);

  useEffect(() => {
    if (applicants) {
      // Create an array of unique job titles
      const uniqueJobTitles = [
        ...new Set(applicants.map((app) => app?.job?.title)),
      ];

      // Map job titles to job objects containing _id and title
      const uniqueJobsData = uniqueJobTitles.map((title) => {
        const job = applicants.find((app) => app?.job?.title === title);
        return {
          _id: job?.job?._id,
          title: job?.job?.title,
        };
      });

      setUniqueJobs(uniqueJobsData);
    }
  }, [applicants]);

  useEffect(() => {
    if (selectedJob && applicants) {
      const filteredApplicants = applicants.filter(
        (app) => app?.job?._id === selectedJob
      );
      setHiredApplicants(filteredApplicants.map((app) => ({ user: app.user })));
      console.log(filteredApplicants.map((app) => ({ user: app.user })));
    } else {
      setHiredApplicants([]);
    }
  }, [selectedJob, applicants]);

  const addApplicant = (user) => {
    setSelectedApplicant((prev) => [...prev, user]);
    setHiredApplicants((prev) =>
      prev.filter((app) => app.user._id !== user._id)
    );
  };

  const removeApplicant = (id) => {
    const removedApplicant = selectedApplicant.find(
      (applicant) => applicant._id === id
    );
    if (removedApplicant) {
      setSelectedApplicant((prev) =>
        prev.filter((applicant) => applicant._id !== id)
      );
      setHiredApplicants((prev) => [...prev, { user: removedApplicant }]);
    }
  };

  const modalClose = () => {
    onHide();
    setSelectedApplicant([]);
    setSelectedJob("");
    setSelectedClient("");
    setConvoTitle("");
  };

  const handleSubmit = async () => {
    const data = {
      title: convoTitle,
      client: selectedClient,
      job: selectedJob,
      users: selectedApplicant.map((applicant) => applicant._id),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/collaborator`,
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
          fnResponse.message || "Collaborator group created successfully!"
        );
        refreshCollaborators();
        modalClose();
      } else {
        toast.error(
          fnResponse.message || "Failed to create collaborator group."
        );
      }
    } catch (error) {
      console.error("Error occurred during fetch:", error);
      toast.error(
        error.message ||
          "An error occurred while creating the collaborator group."
      );
    }
  };

  return (
    <Modal
      show={show}
      onHide={modalClose}
      size="md"
      isStatic
      title="Create new group"
      onSubmit={handleSubmit}
      submitMessage="create group">
      <div className="row mx-0 g-3">
        <div className="input-container">
          <label htmlFor="" className="form-label">
            Enter conversation title
          </label>
          <input
            type="text"
            className="form-control form-control-light"
            value={convoTitle}
            onChange={(e) => setConvoTitle(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label className="form-label">Select client</label>
          <select
            className="form-control form-control-light"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}>
            <option value="">Select a client</option>
            {clients.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="input-container">
          <label className="form-label">Select Job</label>
          <select
            className="form-control form-control-light"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}>
            <option value="">Select a job</option>
            {uniqueJobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        {selectedJob && (
          <div className="d-flex input-container">
            <div className="input-group col">
              <label className="form-label">Select Applicants</label>
              <div className="display-selected hstack col-12">
                {hiredApplicants.map((app) => (
                  <CustomPillButton
                    key={app?.user?._id || "None"}
                    label={app?.user?.fullName || "None"}
                    onClick={() => addApplicant(app?.user || "None")}
                  />
                ))}
              </div>
            </div>
            <div className="input-group col">
              <label className="form-label">Selected</label>
              <span className="display-selected hstack g-3 p-2 col-12">
                {selectedApplicant.map((selected) => (
                  <CustomPillButton
                    key={selected._id}
                    label={selected.fullName}
                    onClick={() => removeApplicant(selected._id)}
                    type="remove"
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddCollaboratorModal;
