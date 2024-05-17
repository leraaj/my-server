import React, { useMemo, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import CustomTable from "../../../../components/table/CustomTable";
import { toast } from "sonner";
import CustomButton from "../../../../components/button/CustomButton";
import AddModal from "./AddModal";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";
const Accounts = () => {
  const API = `${process.env.REACT_APP_API_URL}/api/`;
  const {
    data: users,
    loading,
    refresh,
    error,
  } = useFetch(`http://localhost:3001/api/users`);
  const data = useMemo(() => {
    if (!users) return []; // Return empty array if users data is not available

    return users.map((user) => {
      const positionLabel =
        user.position === 1
          ? "Admin"
          : user.position === 2
          ? "Client"
          : user.position === 3
          ? "Applicant"
          : ""; // Assuming user.fullName is the full name

      return {
        id: user?._id,
        fullName: user?.fullName, // Assuming user.fullName is the full name
        contact: user?.contact, // Assuming user.fullName is the full name
        email: user?.email, // Assuming user.fullName is the full name
        username: user?.username, // Assuming user.fullName is the full name
        password: user?.password,
        positionLabel: positionLabel,
        position: user?.position,
      };
    });
  }, [users]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName", // Since the full name is directly accessible
        header: "Full Name",
        size: 50,
        grow: true,
      },
      {
        accessorKey: "contact", // Since the full name is directly accessible
        header: "Contact Number",
        size: 50,
        grow: true,
      },
      {
        accessorKey: "email", // Since the full name is directly accessible
        header: "Email",
        size: 50,
        grow: true,
      },
      {
        accessorKey: "username", // Since the full name is directly accessible
        header: "Username",
        size: 50,
        grow: true,
      },
      {
        accessorKey: "positionLabel", // Since the full name is directly accessible
        header: "Position",
        size: 50,
        grow: true,
        filterVariant: "multi-select",
        filterSelectOptions: ["Admin", "Applicant", "Client"],
      },
    ],
    []
  );
  const [selectedUser, setSelectedUser] = useState({});
  // ADD MODAL VARIABLES
  const [addUserModal, setAddUserModal] = useState(null);
  const showAddUserModal = () => {
    setAddUserModal(true);
  };
  const hideAddUser = () => {
    setAddUserModal(false);
  };
  // EDIT MODAL VARIABLES
  const [editUserModal, setEditUserModal] = useState(null);
  const showEditUserModal = () => {
    setEditUserModal(true);
  };
  const hideEditUser = () => {
    setEditUserModal(false);
  };
  // DELETE MODAL VARIABLES
  const [deleteUserModal, setDeleteUserModal] = useState(null);
  const showDeleteUserModal = () => {
    setDeleteUserModal(true);
  };
  const hideDeleteUser = () => {
    setDeleteUserModal(false);
  };

  return (
    <>
      <CustomTable
        data={data}
        columns={columns}
        enableLoading={loading}
        renderRowActions={({ row }) => (
          <div className={"d-flex gap-1"}>
            <CustomButton
              size="sm"
              color="dark"
              isModal
              label="Update"
              onClick={() => {
                const user = row.original;
                setSelectedUser(user);
                showEditUserModal();
              }}
            />
            <CustomButton
              size="sm"
              color="dark"
              isModal
              label="Delete"
              onClick={() => {
                const user = row.original;
                setSelectedUser(user);
                showDeleteUserModal();
              }}
            />
          </div>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <CustomButton
              size="sm"
              color="dark"
              isModal
              label="Add user"
              onClick={showAddUserModal}
            />
          </>
        )}
      />
      <AddModal show={addUserModal} onHide={hideAddUser} refresh={refresh} />
      <UpdateModal
        show={editUserModal}
        onHide={hideEditUser}
        refresh={refresh}
        selectedUser={selectedUser}
      />
      <DeleteModal
        show={deleteUserModal}
        onHide={hideDeleteUser}
        refresh={refresh}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default Accounts;
