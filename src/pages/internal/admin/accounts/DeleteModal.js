import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
const DeleteModal = ({ show, onHide, refresh, selectedUser }) => {
  const API = `${process.env.REACT_APP_API_URL}/api/`;
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleValue = (e) => {
    setInputValue(e.target.value);
  };
  const checkValue = (value) => {
    return value === "delete";
  };
  const onClose = () => {
    setInputValue("");
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkValue(inputValue)) return;
    try {
      setIsLoading(true);
      const response = await fetch(`${API}user/${selectedUser?.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const userData = await response.json();
      if (response.ok) {
        setIsLoading(false);
        toast.success("Changes saved successfully");
        refresh();
        onClose();
      } else {
        throw new Error(userData.message); // Throw an error with the message from the server
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message); // Display the error message
    }
  };
  return (
    <Modal
      isLoading={isLoading}
      show={show}
      onHide={onClose}
      title="Delete User">
      <div className="col">
        <label className="form-label">
          This action cannot be undone. Are you sure you want to delete this
          user?
          <br />
          {selectedUser?.fullName}
          <br />
          To confirm, type "<span className="text-danger">delete</span>" in the
          box below
        </label>
        <input
          type="text"
          className={`form-control ${checkValue(inputValue) && "is-valid"} `}
          value={inputValue}
          onChange={handleValue}
          autoComplete="off"
        />
      </div>
      <div className="col pt-2 ">
        <button
          type="submit"
          className="btn btn-dark float-end"
          onClick={handleSubmit}>
          {isLoading ? (
            <>
              <span>
                Deleting user{" "}
                <div class="spinner-border spinner-border-sm  " role="status" />
              </span>
            </>
          ) : (
            "Delete user"
          )}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
