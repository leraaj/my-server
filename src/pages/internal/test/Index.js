import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const Index = () => {
  const API = `${process.env.REACT_APP_API_URL}/api/user`;
  const [hasErrors, setHasErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email().required("Email is required"),
    contact: yup.number().required("Contact number is required"),
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    position: yup.number().required("Position is required"),
    applicationStatus: yup.number().default(2),
  });
  const {
    register,
    getValues,
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
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const addData = await response.json();
      if (!response.ok) {
        console.log(response);
        if (response.status === 400 || response.status === 500) {
          toast.warning(response.status);
        } else if (response.status === 401) {
          toast.error("Error 401");
        }
        setIsLoading(false);
      } else {
        toast.success("User added successfully");
        onClose();
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };
  const [showModal, setShowModal] = useState(null);

  const openModal = () => {
    setShowModal(true);
  };

  const onHide = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* <button className="btn btn-primary" onClick={openModal}>
        Open Modal
      </button>
      <Modal
        show={showModal}
        onHide={onHide}
        isStatic
        onSubmit={handleSubmit(onSubmit)}
        reset={reset}>
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
            />
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
            />
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
          </div>
        </div>
      </Modal> */}
      <div className="py-2 d-flex align-items-center gap-2">
        <button className="cs-button primary">primary</button>
        <button className="cs-button secondary">secondary</button>
        <button className="cs-button dark">dark</button>
        <button className="cs-button light">light</button>
        <button className="cs-button success">success</button>
        <button className="cs-button danger">danger</button>
        <button className="cs-button warning">warning</button>
      </div>
      <div className="py-2 d-flex align-items-center gap-2 ">
        <button className="cs-button primary size-sm">sm</button>
        <button className="cs-button primary">default</button>
        <button className="cs-button primary size-md">md</button>
        <button className="cs-button primary size-lg">lg</button>
      </div>
      <div className="py-2  d-flex align-items-center gap-2 ">
        <button className="cs-button outline-primary">outline-primary</button>
        <button className="cs-button outline-secondary">
          outline-secondary
        </button>
        <button className="cs-button outline-dark">outline-dark</button>
        <button className="cs-button outline-light">outline-light</button>
        <button className="cs-button outline-success">outline-success</button>
        <button className="cs-button outline-danger">outline-danger</button>
        <button className="cs-button outline-warning">outline-warning</button>
      </div>
    </>
  );
};

export default Index;
{
  /* <ModalBody>
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
              />
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
              />
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
            </div>
          </div>
        </ModalBody>
        <ModalFooter handleCloseModal={onClose} isLoading={isLoading} /> */
}
