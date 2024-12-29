import React from "react";
import AddPhotoImage from "../../../../assets/icons/plus.svg";

const PortfolioModal = ({ showImageModal, files }) => {
  return (
    <div className="pill-details ">
      <span className="col-12 pill-label mb-2 d-flex justify-content-between">
        <div>Portfolio</div>
        <div>
          <button
            type="button"
            className="btn btn-sm btn-dark gap-1 d-flex align-items-center">
            <img src={AddPhotoImage} className="icon" height={10} />
            Add File
          </button>
        </div>
      </span>
      <span className="col-12 d-flex flex-wrap pill-body">
        {/* <img
                      src={placeholder}
                      className="pill-images"
                      onClick={showImageModal}
                    /> */}

        {files?.map((index, file) => {
          const fileType = file?.type;
          return fileType === "/image" ? (
            <img
              key={index}
              src={file?.fileUrl}
              className="pill-images"
              onClick={showImageModal}
            />
          ) : (
            <button key={index} className="btn btn-sm btn-dark">
              {file?.name}
            </button>
          );
        })}
      </span>
    </div>
  );
};

export default PortfolioModal;
