import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const Register = () => {
  const navigate = useNavigate();
  const { data: jobs } = useFetch(`${process.env.REACT_APP_API_URL}/api/jobs`);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email().required("Email is required"),
    contact: yup.string().required("Contact number is required"),
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    position: yup.number().required("Position is required"),
    applicationStatus: yup.number().default(2),
    // skills: yup
    //   .array()
    //   .min(1, "At least one skill is required when position is 'Applicant'")
    //   .required("At least one skill is required when position is 'Applicant'"),
  });
  const {
    register,
    setError,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const fnResponse = await response.json();

      if (response.ok) {
        toast.success("Success: The request was successful.");
        setIsLoading(false);
      } else {
        if (
          response.status === 409 &&
          fnResponse.duplicates &&
          fnResponse.duplicates.length > 0
        ) {
          toast.error(
            "Conflict: There is a conflict with the current state of the resource.",
            response
          );
          fnResponse.duplicates.forEach((fieldError) => {
            setError(fieldError, {
              type: "duplicated",
              message: `This field already exists`,
            });
          });
          setIsLoading(false);
        } else {
          toast.error(response);
          setIsLoading(false);
        }
      }
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };
  const CheckFieldValue = (value) => {
    const valid = useWatch({
      control,
      name: `${value}`,
    });
    return valid ? "is-valid" : "";
  };
  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skillId)
        ? prevSkills.filter((id) => id !== skillId)
        : [...prevSkills, skillId]
    );
  };
  return (
    <div className="landing-section d-flex justify-content-center ">
      <div className="col">
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          create
          <br />
          your account
        </span>
        <form
          className="needs-validation row mx-0 g-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate>
          {/* Name */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">client name</span>
            <input
              type="text"
              className={`form-control form-control-light ${
                errors.fullName && "is-invalid"
              } ${CheckFieldValue("fullName")}`}
              {...register("fullName")}
              required
            />
            {errors.fullName && (
              <span className="invalid-feedback">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Position */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">position</span>
            <select
              className={`form-control form-control-light ${
                errors.position && "is-invalid"
              } ${CheckFieldValue("position")}`}
              {...register("position")}
              required>
              <option value="" selected>
                Select you position
              </option>
              <option value="2">Client</option>
              <option value="3">Applicant</option>
            </select>
            {errors.position && (
              <span className="invalid-feedback">
                {errors.position.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">email</span>
            <input
              type="text"
              className={`form-control form-control-light ${
                errors.email && "is-invalid"
              } ${CheckFieldValue("email")}`}
              {...register("email")}
              required
            />
            {errors.email && (
              <span className="invalid-feedback">{errors.email.message}</span>
            )}
          </div>

          {/* Contact */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">contact</span>
            <input
              type="text"
              className={`form-control form-control-light ${
                errors.contact && "is-invalid"
              } ${CheckFieldValue("contact")}`}
              {...register("contact")}
              required
            />
            {errors.contact && (
              <span className="invalid-feedback">{errors.contact.message}</span>
            )}
          </div>

          {/* Username */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">username</span>
            <input
              type="text"
              className={`form-control form-control-light ${
                errors.username && "is-invalid"
              } ${CheckFieldValue("username")}`}
              {...register("username")}
              required
            />
            {errors.username && (
              <span className="invalid-feedback">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">password</span>
            <input
              type="password"
              className={`form-control form-control-light ${
                errors.password && "is-invalid"
              } ${CheckFieldValue("password")}`}
              {...register("password")}
              required
            />
            {errors.password && (
              <span className="invalid-feedback">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="col-12 d-flex justify-content-end align-items-end">
            <button
              type="submit"
              className={`primary-btn btn-${
                isLoading ? "secondary" : "success"
              } order-2 `}>
              {isLoading ? "Loading" : "register"}
            </button>
          </div>
          <div className="col-12 d-flex justify-content-start align-items-end">
            <button
              type="button"
              className="secondary-btn secondary-btn"
              onClick={() => navigate("/")}>
              back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
