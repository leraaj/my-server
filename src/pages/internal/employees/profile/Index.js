import React from "react";
import { useAuthContext } from "../../../../hooks/context/useAuthContext";
const Profile = () => {
  const { user } = useAuthContext();
  return (
    <div className="col-12 row mx-0 gap-1">
      <div className=" d-flex justify-content-between align-items-center">
        <span>User Information</span>
        <button className="btn btn-dark col-auto">Update user details</button>
      </div>
      <div className="col row mx-0 g-2">
        <div className="col-12">
          <label className="form-label text-capitalize">full name</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={user?.fullName}
            disabled
            readOnly
          />
        </div>
        <div className="col-6">
          <label className="form-label text-capitalize">contact</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={user?.contact}
            disabled
            readOnly
          />
        </div>
        <div className="col-6">
          <label className="form-label text-capitalize">email</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={user?.email}
            disabled
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
