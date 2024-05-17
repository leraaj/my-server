import React, { useEffect, useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const UpdateModal = ({ show, onHide, refresh, selectedUser }) => {
  const API = `${process.env.REACT_APP_API_URL}/api/user/${selectedUser?.id}`;
  const [hasErrors, setHasErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email().required("Email is required"),
    contact: yup.string().required("Contact number is required"),
    username: yup.string().required("Username is required"),
    password: yup.string(),
    position: yup.number().required("Position is required"),
  });
  const {
    register,
    setValue,
    setError,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onClose = () => {
    onHide();
    reset();
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
      const response = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const fnResponse = await response.json();
      if (response.ok) {
        console.log(fnResponse);
        toast.success("User added successfully");
        submitComplete();
        setIsLoading(false);
      } else {
        console.log(fnResponse);
        if (fnResponse.duplicates.length > 0) {
          toast.error("Error 409: Conflict");
          fnResponse.duplicates.forEach((fieldError) => {
            setError(`${fieldError}`, {
              type: "duplicated",
              message: `This ${fieldError} already exists`,
            });
          });
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error}`);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setValue("fullName", selectedUser?.fullName);
    setValue("email", selectedUser?.email);
    setValue("contact", selectedUser?.contact);
    setValue("username", selectedUser?.username);
    setValue("position", selectedUser?.position);
  }, [selectedUser]);
  return (
    <Modal
      show={show}
      onHide={onClose}
      isStatic
      title="Update user"
      onSubmit={handleSubmit(onSubmit)}
      reset={reset}
      isLoading={isLoading}>
      <div className="row mx-0 g-2">
        <div className="col-12 col-lg-8">
          <label className="form-label">Full name</label>
          <input
            type="text"
            className={`form-control ${errors?.fullName && "is-invalid"}`}
            placeholder={`Enter your full name`}
            name="fullName"
            {...register("fullName")}
            required
          />
          {errors?.fullName && (
            <span className="invalid-feedback">{errors.fullName.message}</span>
          )}
        </div>
        <div className="col-12 col-lg-4">
          <label className="form-label">Position</label>
          <select
            className={`form-control ${errors?.position && "is-invalid"}`}
            name="position"
            {...register("position")}
            required>
            <option value="">Select position</option>
            <option value="1">Admin</option>
            <option value="2">Client</option>
            <option value="3">Applicant</option>
          </select>
          {errors?.position && (
            <span className="invalid-feedback">{errors.position.message}</span>
          )}
        </div>
        <div className="col-12 col-lg-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors?.email && "is-invalid"}`}
            placeholder="Enter your email"
            name="email"
            {...register("email")}
            required
          />{" "}
          {errors?.email && (
            <span className="invalid-feedback">{errors.email.message}</span>
          )}
        </div>
        <div className="col-12 col-lg-6">
          <label className="form-label">Contact Number</label>
          <input
            type="number"
            className={`form-control ${errors?.contact && "is-invalid"}`}
            placeholder="Enter your contact number"
            name="contact"
            {...register("contact")}
            required
          />
          {errors?.contact && (
            <span className="invalid-feedback">{errors.contact.message}</span>
          )}
        </div>
        <div className="col-12 col-lg-6">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors?.username && "is-invalid"}`}
            placeholder="Enter your username"
            name="username"
            {...register("username")}
            required
          />{" "}
          {errors?.username && (
            <span className="invalid-feedback">{errors.username.message}</span>
          )}
        </div>
        <div className="col-12 col-lg-6">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors?.password && "is-invalid"}`}
            placeholder={`Enter your password`}
            name="password"
            {...register("password")}
            required
          />
          {errors?.password && (
            <span className="invalid-feedback">{errors.password.message}</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;
