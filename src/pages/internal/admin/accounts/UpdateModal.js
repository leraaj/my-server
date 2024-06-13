import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const UpdateModal = ({ show, onHide, refresh, selectedUser }) => {
  const UPDATE_API_URL = `${process.env.REACT_APP_API_URL}/api/user/${selectedUser?.id}`;
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object().shape(
    {
      fullName: yup.string().required("Full name is required"),
      email: yup.string().email().required("Email is required"),
      contact: yup.string().required("Contact number is required"),
      username: yup.string().required("Username is required"),
      password: yup.string(),
      position: yup.string().required("Position is required"),
    },
    [selectedUser]
  );
  const {
    register,
    setValue,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: selectedUser?.fullName || "",
      email: selectedUser?.email || "",
      contact: selectedUser?.contact || "",
      username: selectedUser?.username || "",
      position: selectedUser?.position || "",
      applicationStatus: selectedUser?.applicationStatus || "",
    },
  });
  useEffect(() => {
    if (selectedUser) {
      // SET DEFAULT VALUES
      reset({
        fullName: selectedUser?.fullName,
        email: selectedUser?.email,
        contact: selectedUser?.contact,
        username: selectedUser?.username,
        position: selectedUser?.position,
        applicationStatus: selectedUser?.applicationStatus,
      });
    }
  }, [selectedUser, reset]);
  const onClose = () => {
    onHide();
  };
  const submitComplete = () => {
    onClose();
    refresh();
  };
  const onSubmit = async (data) => {
    const formData = { ...data };
    if (!formData.password) {
      delete formData.password; // Remove password field if it's empty
    }
    try {
      setIsLoading(true);
      const response = await fetch(UPDATE_API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const fnResponse = await response.json();
      if (response.ok) {
        toast.success("Success: The request was successful.");
        submitComplete();
      } else {
        if (
          response.status === 409 &&
          fnResponse.duplicates &&
          fnResponse.duplicates.length > 0
        ) {
          toast.error(
            "Conflict: There is a conflict with the current state of the resource."
          );
          fnResponse.duplicates.forEach((fieldError) => {
            setError(fieldError, {
              type: "duplicated",
              message: `This field already exists`,
            });
          });
        } else {
          toast.error(response);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      isStatic
      title="Update user"
      onSubmit={handleSubmit(onSubmit)}
      reset={reset}
      isLoading={isLoading}
      size="lg">
      <div className="d-flex gap-2">
        <div className="col-12 col-sm">
          <div className="col-12  mb-2">
            <label className="form-label">Full name</label>
            <input
              type="text"
              className={`form-control form-control-light ${
                errors?.fullName && "is-invalid"
              }`}
              placeholder={`Enter your full name`}
              name="fullName"
              {...register("fullName")}
              required
            />
            {errors?.fullName && (
              <span className="invalid-feedback">
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div className="col-12  mb-2">
            <label className="form-label">Position</label>
            <select
              className={`form-control form-control-light ${
                errors?.position && "is-invalid"
              }`}
              name="position"
              {...register("position")}
              required>
              <option value="">Select position</option>
              <option value="1">Admin</option>
              <option value="2">Client</option>
              <option value="3">Applicant</option>
            </select>
            {errors?.position && (
              <span className="invalid-feedback">
                {errors.position.message}
              </span>
            )}
          </div>
          <div className="col-12 mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control  form-control-light ${
                errors?.email && "is-invalid"
              }`}
              placeholder="Enter your email"
              name="email"
              {...register("email")}
              required
            />{" "}
            {errors?.email && (
              <span className="invalid-feedback">{errors.email.message}</span>
            )}
          </div>
          <div className="col-12 mb-2">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              className={`form-control  form-control-light ${
                errors?.contact && "is-invalid"
              }`}
              placeholder="Enter your contact number"
              name="contact"
              {...register("contact")}
              required
            />
            {errors?.contact && (
              <span className="invalid-feedback">{errors.contact.message}</span>
            )}
          </div>
        </div>
        <div className="col-12 col-sm">
          <div className="col-12 mb-2">
            <label className="form-label">Username</label>
            <input
              type="text"
              className={`form-control  form-control-light ${
                errors?.username && "is-invalid"
              }`}
              placeholder="Enter your username"
              name="username"
              {...register("username")}
              required
            />{" "}
            {errors?.username && (
              <span className="invalid-feedback">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="col-12 mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control  form-control-light ${
                errors?.password && "is-invalid"
              }`}
              placeholder={`Enter your password`}
              name="password"
              {...register("password")}
              required
            />
            {errors?.password && (
              <span className="invalid-feedback">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="col-12  mb-2">
            <label className="form-label">Application Status</label>
            <select
              className={`form-control form-control-light ${
                errors?.position && "is-invalid"
              }`}
              name="position"
              {...register("applicationStatus")}
              required>
              <option value="">Select Application Status</option>
              <option value="2">Pending</option>
              <option value="3">Accepted</option>
              <option value="4">Declined</option>
            </select>
            {errors?.position && (
              <span className="invalid-feedback">
                {errors.position.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;
