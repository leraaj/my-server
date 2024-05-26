import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import { toast } from "sonner";

const AddJobModal = ({ show, onHide, refresh }) => {
  const { data: categoryData, loading: categoryLoading } = useFetch(
    `${process.env.REACT_APP_API_URL}/api/categories`
  );
  const JobSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    category: yup.string().required("Category is required"),
    details: yup.object().shape({
      why: yup.string().required("Description (why) is required"),
      what: yup.string().required("Description (what) is required"),
      benefits: yup.object().shape({
        pay: yup.string().required("Pay is required"),
        schedule: yup.string().required("Schedule is required"),
      }),
      responsibilities: yup
        .array()
        .of(yup.string().required("Responsibility is required"))
        .min(1, "At least one responsibility is required"),
      requirements: yup
        .array()
        .of(yup.string().required("Requirement is required"))
        .min(1, "At least one requirement is required"),
    }),
  });
  const {
    handleSubmit,
    register,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(JobSchema),
  });

  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control,
    name: "details.responsibilities",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "details.requirements",
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
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
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
            "Conflict: There is a conflict with the current state of the resource.",
            response
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
      toast.error(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      title="Add Job"
      size="fullscreen"
      onSubmit={handleSubmit(onSubmit)}
      isStatic>
      <div className="row mx-0 g-2 col-12">
        <div className="col-12">
          <label className="form-label">Title</label>
          <input className={`form-control`} {...register("title")} />
          {errors.title && (
            <p className="text-danger">{errors.title.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Category</label>
          <select className="form-select " {...register("category")}>
            {categoryData?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-danger">{errors.category.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Why</label>
          <input className={`form-control`} {...register("details.why")} />
          {errors.details?.why && (
            <p className="text-danger">{errors.details.why.message}</p>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">What</label>
          <input className={`form-control`} {...register("details.what")} />
          {errors.details?.what && (
            <p className="text-danger">{errors.details.what.message}</p>
          )}
        </div>
        {/* LISTS */}
        <div className="row mx-0 h-100">
          <div className="row mx-0 g-2 col h-100">
            <label className="form-label">Responsibilities</label>
            <button
              className={`btn ${
                errors.details?.responsibilities ? "btn-danger" : "btn-dark"
              }`}
              type="button"
              onClick={() => appendResponsibility("")}>
              Add Responsibility
            </button>
            {responsibilityFields.map((field, index) => (
              <>
                <div key={field.id} className="input-group">
                  <input
                    className={`form-control`}
                    {...register(`details.responsibilities.${index}`)}
                  />
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => removeResponsibility(index)}>
                    Remove
                  </button>
                </div>
                {errors.details?.responsibilities?.[index] && (
                  <p className="text-danger">
                    {errors.details?.responsibilities[index].message}
                  </p>
                )}
              </>
            ))}
          </div>
          <div className="row mx-0 g-2 col h-100">
            <label className="form-label">Requirements</label>
            <button
              className={`btn ${
                errors.details?.requirements ? "btn-danger" : "btn-dark"
              }`}
              type="button"
              onClick={() => appendRequirement("")}>
              Add Requirement
            </button>
            {requirementFields.map((field, index) => (
              <>
                <div key={field.id} className="input-group">
                  <input
                    className={`form-control`}
                    {...register(`details.requirements.${index}`)}
                  />
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => removeRequirement(index)}>
                    Remove
                  </button>
                </div>
                {errors.details?.requirements?.[index] && (
                  <p className="text-danger">
                    {errors.details?.requirements[index].message}
                  </p>
                )}
              </>
            ))}
          </div>
        </div>
        {/* BENEFITS */}
        <div className="col-12">
          <label className="form-label">Benefits</label>
          <div className="d-flex gap-2">
            <div className="col">
              <input
                className={`form-control`}
                {...register("details.benefits.pay")}
              />
              {errors.details?.benefits?.pay && (
                <p className="text-danger">
                  {errors.details.benefits.pay.message}
                </p>
              )}
            </div>
            <div className="col">
              <input
                className={`form-control`}
                {...register("details.benefits.schedule")}
              />
              {errors.details?.benefits?.schedule && (
                <p className="text-danger">
                  {errors.details.benefits.schedule.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddJobModal;
