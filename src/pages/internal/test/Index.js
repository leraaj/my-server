import React, { useState, useEffect } from "react";
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
  const [selectedPosition, setSelectedPosition] = useState(null);

  const schema = yup.object().shape({
    position: yup.number().required("Position is required"),
    skills: yup
      .array()
      .min(1, "At least one skill is required when position is 'Applicant'")
      .required("At least one skill is required when position is 'Applicant'"),
  });

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("skills", selectedSkills);
  }, [selectedSkills, setValue]);

  useEffect(() => {
    console.log(selectedSkills);
  }, [selectedSkills]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      alert(JSON.stringify(data));
    } catch (error) {
      toast.error(error.message);
    } finally {
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
    <div className="landing-section d-flex justify-content-center">
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
          {/* Position */}
          <div className="input-container col-12 col-md-6">
            <span className="form-label">position</span>
            <select
              className={`form-control form-control-light ${
                errors.position && "is-invalid"
              }`}
              {...register("position")}
              required>
              <option value="" selected>
                Select your position
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
          <div className="input-container col-12 col-md-6">
            <span className="form-label">skills</span>
            <div
              className={`text-wrap row mx-0 gap-2 col-12 border ${
                errors.skills && "border-danger"
              }`}>
              {jobs?.map((job, index) => (
                <button
                  type="button"
                  key={index}
                  className={`btn btn-outline-light col-auto rounded-pill ${
                    selectedSkills.includes(job._id) ? "active" : ""
                  }`}
                  onClick={() => handleSkillToggle(job._id)}>
                  {job.title}
                </button>
              ))}
            </div>
            {errors.skills && (
              <span className="invalid-feedback">{errors.skills.message}</span>
            )}
          </div>

          {/* Form Submission Buttons */}
          <div className="col-12 d-flex justify-content-between align-items-end">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/")}>
              back
            </button>
            <button
              type="submit"
              className={`primary-btn btn-${
                isLoading ? "secondary" : "success"
              } order-2`}>
              {isLoading ? "Loading" : "register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
