import React from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
import placeholder from "../../../../assets/images/placeholder/img_blank.png";
const Profile = () => {
  const { user } = useAuthContext();
  return (
    <div
      className="overflow-auto"
      style={{
        backgroundColor: "var(--light-100)",
        height: "calc(100dvh - 100px - 0.5rem)",
        marginBlock: "0.5rem",
        borderRadius: "0.5rem",
      }}>
      <div className="col row mx-0 px-3 g-3 ">
        <div className="col-12 col-lg row mx-0 g-3">
          <div className="input-container">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.fullName}
              readOnly
              disabled
            />
          </div>
          <div className="input-container col">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.email}
              readOnly
              disabled
            />
          </div>
          <div className="input-container col">
            <label className="form-label">Contact</label>
            <input
              type="text"
              className="form-control form-control-light"
              defaultValue={user?.contact}
              readOnly
              disabled
            />
          </div>
          <div className="input-container">
            <label className="form-label">Resume/CV</label>
            <div className="col-auto">
              <button type="button" className="btn btn-dark ">
                Download
              </button>
            </div>
          </div>
          {user?.position === 3 && (
            <div className="input-container">
              <label className="form-label">Skills</label>
              <div className="row mx-0 gap-2 flex-wrap">
                <span className="btn btn-dark col-auto">1 skill</span>
                <span className="btn btn-dark col-auto">2 skill</span>
                <span className="btn btn-dark col-auto">3 skill</span>
                <span className="btn btn-dark col-auto">4 skill</span>
                <span className="btn btn-dark col-auto">5 skill</span>
                <span className="btn btn-dark col-auto">6 skill</span>
                <span className="btn btn-dark col-auto">7 skill</span>
                <span className="btn btn-dark col-auto">8 skill</span>
                <span className="btn btn-dark col-auto">9 skill</span>
                <span className="btn btn-dark col-auto">10 skill</span>
              </div>
            </div>
          )}
        </div>
        {user?.position === 3 && (
          <div className="col-12 col-lg row mx-0 g-3">
            <div className="input-container">
              <label className="form-label">Portfolio</label>
              <div className="col-12 row mx-0 g-2 overflow-auto">
                <img
                  src={placeholder}
                  style={{
                    height: "140px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <img
                  src={placeholder}
                  style={{
                    height: "140px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <img
                  src={placeholder}
                  style={{
                    height: "140px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
