import React, { useMemo, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import CustomTable from "../../../../components/table/CustomTable";
import { toast } from "sonner";
import CustomButton from "../../../../components/button/CustomButton";
const Applicants = () => {
  const API = `${process.env.REACT_APP_API_URL}`;
  const { data: users, loading, refresh, error } = useFetch(`${API}/api/users`);
  const data = useMemo(() => {
    if (!users) return []; // Return empty array if users data is not available

    return users
      .filter((user) => user.position === 3)
      .map((user) => {
        return {
          id: user._id,
          fullName: user.fullName,
          contact: user.contact,
          email: user.email,
          username: user.username,
          password: user.password,
          position: user.position,
        };
      });
  }, [users]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName", // Since the full name is directly accessible
        header: "Full Name",
      },
      {
        accessorKey: "contact", // Since the full name is directly accessible
        header: "Contact Number",
      },
      {
        accessorKey: "email", // Since the full name is directly accessible
        header: "Email",
      },
      {
        accessorKey: "username", // Since the full name is directly accessible
        header: "Username",
      },
    ],
    [users]
  );

  return (
    <>
      <CustomTable
        data={data}
        columns={columns}
        enableLoading={loading}
        renderRowActions={({ row }) => (
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-dark text-nowrap">
              View profile
            </button>
          </div>
        )}
        renderTopToolbarCustomActions={() => <></>}
      />
    </>
  );
};

export default Applicants;
