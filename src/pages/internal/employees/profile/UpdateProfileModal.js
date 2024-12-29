import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";

import ViewImageModal from "./ViewImageModal";
import PortfolioTab from "./PortfolioTab";
import SkillsTab from "./SkillsTab";
import axios from "axios";

const Index = ({ show, onHide }) => {
  const isStatic = true;
  const { user, updateResume, API_URL } = useAuthContext();
  const API = `${API_URL}/api`;
  const [file, setFile] = useState(null);
  // VIEW IMAGE MODAL VARIABLES
  const [viewImageModal, setViewImageModal] = useState(null);
  const showImageModal = () => {
    setViewImageModal(true);
  };
  const hideImageModal = () => {
    setViewImageModal(false);
  }; // VIEW IMAGE MODAL VARIABLES
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the selected file
  };
  const handleSubmit = async () => {
    if (file) {
      handleCVUpload();
    }
    try {
    } catch (error) {
      alert(`Error:\n${error}`);
    }
  };
  const handleCVUpload = async () => {
    if (!file) {
      return alert("No file selected");
    }
    console.log(file);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("name", file?.name);
    formData.append("id", user?._id);

    try {
      const res = await axios.post(`${API_URL}/api/upload-resume`, formData);

      const file = res?.data?.file;
      const name = file?.name;
      const id = file?.id;
      const mimeType = file?.mimeType;

      console.log(
        `Uploaded Resume Details:\n${JSON.stringify(res.data, null, 2)}`
      );

      // Update the resume with the new details (id, name, mimeType)
      updateResume({ id, name, mimeType });
      onHide(); // Close the modal after uploading
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        title={`Update Profile [Show: ${show}, isStatic: ${isStatic}]`}
        size={"fullscreen"}
        isStatic={isStatic}
        onSubmit={handleSubmit}>
        <div className="profile-container">
          <div className="body overflow-auto ">
            <div className="col-auto photo-name-container mb-3">
              <img
                src={user?.profile ? placeholder : placeholder}
                className="profile-picture"
              />
              <span className="col" aria-label="gap-filler" />
            </div>
            <div className="col vstack">
              <span className="form-label mb-3 fs-5">About</span>
              <div className="pill-details ">
                <span className="pill-label">Full Name</span>
                <span>
                  <input
                    type="text"
                    className="form-control form-control-light"
                    value={user?.fullName}
                  />
                </span>
              </div>
              <div className="pill-details ">
                <span className="pill-label">Email</span>
                <span>
                  <input
                    type="text"
                    className="form-control form-control-light"
                    value={user?.email}
                  />
                </span>
              </div>
              <div className="pill-details ">
                <span className="pill-label">Contact Number</span>
                <span>
                  <input
                    type="text"
                    className="form-control form-control-light"
                    value={user?.contact}
                  />
                </span>
              </div>
              <div className=" pill-details ">
                <span className="pill-label col-auto">Resume/CV</span>
                <span className="d-flex align-items-center gap-2">
                  <span className="col">
                    <input
                      type="file"
                      name="resume"
                      className="form-control form-control-light "
                      onChange={handleFileChange}
                      accept=" application/pdf ,  application/msword ,  application/vnd.openxmlformats-officedocument.wordprocessingml.document "
                    />
                  </span>
                </span>
              </div>
              <SkillsTab skills={user?.skills} />
              <PortfolioTab
                showImageModal={showImageModal}
                files={user?.portfolio}
              />
            </div>
          </div>
        </div>
      </Modal>
      <ViewImageModal show={viewImageModal} onHide={hideImageModal} />
    </>
  );
};

export default Index;
