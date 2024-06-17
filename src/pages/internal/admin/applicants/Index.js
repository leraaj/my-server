import React, { useMemo, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import CustomTable from "../../../../components/table/CustomTable";
import { toast } from "sonner"; // Assuming 'sonner' is your toast library
import AppointmentsModal from "./AppointmentsModal";
import ApplicationsModal from "./ApplicationsModal";
import ViewProfileModal from "./ViewProfileModal";

const Applicants = () => {
  const API = process.env.REACT_APP_API_URL || ""; // Ensure API URL is correctly loaded from environment
  const {
    data: users,
    loading: userLoading,
    refresh: userRefresh,
  } = useFetch(`${API}/api/users`);

  const [user, setUser] = useState({});

  const data = useMemo(() => {
    if (!users) return [];
    return users
      .filter((user) => user.position === 3)
      .map((user) => ({
        id: user._id,
        fullName: user.fullName,
        contact: user.contact,
        email: user.email,
        username: user.username,
        password: user.password,
        position: user.position,
        applicationTasks: user.applicationTasks,
        appointmentTasks: user.appointmentTasks,
      }));
  }, [users]);

  const columns = useMemo(
    () => [
      { accessorKey: "fullName", header: "Full Name" },
      { accessorKey: "contact", header: "Contact Number" },
      { accessorKey: "email", header: "Email" },
    ],
    []
  );
  // Application Modal Variables
  const [applicationModal, setApplicationModal] = useState(null);
  const showApplicationModal = () => {
    setApplicationModal(true);
  };

  const hideApplicationModal = () => {
    setApplicationModal(false);
  };

  // Appointment Modal Variables
  const [appointmentModal, setAppointmentModal] = useState(null);
  const showAppointmentModal = () => {
    setAppointmentModal(true);
  };

  const hideAppointmentModal = () => {
    setAppointmentModal(false);
  };
  // Profile Modal Variables
  const [profileModal, setProfileModal] = useState(null);
  const showProfileModal = () => {
    setProfileModal(true);
  };

  const hideProfileModal = () => {
    setProfileModal(false);
  };
  return (
    <>
      <CustomTable
        data={data}
        columns={columns}
        enableLoading={userLoading}
        renderRowActions={({ row }) => {
          const user = row.original;
          return (
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-dark text-nowrap position-relative"
                onClick={() => {
                  setUser(user);
                  showProfileModal();
                }}>
                View profile
              </button>
              <button
                className="btn btn-sm btn-dark text-nowrap position-relative"
                onClick={() => {
                  setUser(user);
                  showApplicationModal();
                }}>
                Application
                {user?.applicationTasks > 0 && (
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {user?.applicationTasks}
                  </span>
                )}
              </button>
              <button
                className="btn btn-sm btn-dark text-nowrap position-relative"
                onClick={() => {
                  setUser(user);
                  showAppointmentModal();
                }}>
                Appointment
                {user?.appointmentTasks > 0 && (
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {user?.appointmentTasks}
                  </span>
                )}
              </button>
            </div>
          );
        }}
      />
      <ApplicationsModal
        show={applicationModal}
        onHide={hideApplicationModal}
        refresh={userRefresh}
        user={user}
      />
      <AppointmentsModal
        show={appointmentModal}
        onHide={hideAppointmentModal}
        user={user}
      />
      <ViewProfileModal
        show={profileModal}
        onHide={hideProfileModal}
        user={user}
      />
    </>
  );
};

export default Applicants;
