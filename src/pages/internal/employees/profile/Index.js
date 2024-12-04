import React, { useState } from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";
import ViewImageModal from "./ViewImageModal";
import UpdateProfileModal from "./UpdateProfileModal";
import "./style.css";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const { user, API_URL } = useAuthContext();
  const API = `${API_URL}/api`;

  // ADD MODAL VARIABLES
  const [viewImageModal, setViewImageModal] = useState(null);
  const showImageModal = () => setViewImageModal(true);
  const hideImageModal = () => setViewImageModal(false);

  // UPDATE PROFILE MODAL VARIABLES
  const [updateProfileModal, setUpdateProfileModal] = useState(null);
  const showUpdateProfileModal = () => setUpdateProfileModal(true);
  const hideUpdateProfileModal = () => setUpdateProfileModal(false);

  // Loading state for resume download
  const [resumeLoad, setResumeLoad] = useState(false);

  const handleCVDownload = async () => {
    setResumeLoad(true); // Set loading state to true while downloading

    try {
      // Make a GET request to download the file as a blob
      const response = await fetch(
        `${API}/download-file/${user?.files?.resume?.id}`,
        {
          method: "GET",
          credentials: "include", // Ensure credentials are sent
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        toast.error(`Error downloading file: ${response.message}`);
        throw new Error("Failed to download file");
      }

      // Extract the filename from the Content-Disposition header
      const filename = user?.files?.resume?.name;
      const fileType = user?.files?.resume?.mimeType;
      // Create a Blob from the response data
      const blob = await response.blob();
      // Create an object URL for the Blob and trigger a download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      console.log(
        `download:\n${JSON.stringify(user?.files?.resume, null, 2)} `
      );
      link.setAttribute("download", `${filename}.${fileType}`); // Set the filename for the download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up
      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Error downloading file: ${error.message}`);
    } finally {
      setResumeLoad(false); // Reset loading state after the download is complete
    }
  };

  return (
    <>
      <div className="profile-container">
        <div className="body overflow-auto">
          <div className="col-auto photo-name-container mb-3">
            <img
              src={user?.profile ? placeholder : placeholder}
              className="profile-picture"
            />
            <span className="col-auto user-fullname">{user?.fullName}</span>
            <span className="col" aria-label="gap-filler" />
            <button className="btn btn-dark" onClick={showUpdateProfileModal}>
              Update Profile
            </button>
          </div>
          <div className="col vstack">
            <span className="form-label mb-3 fs-5">About</span>
            <div className="pill-details">
              <span className="pill-label">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="pill-details">
              <span className="pill-label">Contact Number</span>
              <span>{user?.contact}</span>
            </div>
            <div className="pill-details">
              <span className="pill-label col-auto">Resume/CV</span>
              <span className="col-12 row align-items-center m-0 p-0">
                <span className="col-12 m-0 p-0 d-flex align-items-center justify-align-content-around">
                  <span className="col  ">
                    {user?.files?.resume?.name || "Upload one?"}
                  </span>
                  <span className="col-auto">
                    <button
                      className="btn btn-dark col"
                      onClick={handleCVDownload}
                      disabled={resumeLoad} // Disable the button while downloading
                    >
                      {resumeLoad ? "Downloading..." : "Download"}
                    </button>
                  </span>
                </span>
              </span>
            </div>
            <div className="col-12 row mx-0 p-0 gap-3">
              <div className="col-12 col-sm pill-details row m-0">
                <span className="col-12 pill-label mb-2">Skills</span>
                <span className="col-12 vstack pill-body">
                  <span className="pill-skills">skill 1</span>
                </span>
              </div>
              <div className="col-12 col-sm pill-details row m-0">
                <span className="col-12 pill-label mb-2">Portfolio</span>
                <span className="col-12 vstack pill-body">
                  <img
                    src={placeholder}
                    className="pill-images"
                    onClick={showImageModal}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateProfileModal
        show={updateProfileModal}
        onHide={hideUpdateProfileModal}
      />
      <ViewImageModal show={viewImageModal} onHide={hideImageModal} />
    </>
  );
};

export default Profile;
