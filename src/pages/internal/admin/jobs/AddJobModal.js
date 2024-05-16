import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const AddJobModal = ({ show, onHide }) => {
  const schema = yup.object().shape({
    title: yup.string().required(),
    category: yup.object().shape({
      // _id: yup.string().required(),
      title: yup.string().required(),
    }),
    details: yup.object().shape({
      why: yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
      }),
      what: yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
      }),
      responsibilities: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one responsibility is required"),
      requirements: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one requirement is required"),
    }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title="Add Job"
      size="fullscreen"
      onSubmit={handleSubmit(onSubmit)}
      isStatic>
      <div className="row mx-0 gap-2">
        <div className="row mx-0 gap-2">
          <div className="col-12 col-sm">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              className={`form-control ${errors?.title && "is-invalid"}`}
              {...register("title")}
            />
            {errors?.title?.message && (
              <span className="invalid-feedback">{errors?.title.message}</span>
            )}
          </div>
          <div className="col-12 col-sm">
            <label className="form-label">Category</label>
            <input
              type="text"
              className={`form-control ${
                errors?.category?.title && "is-invalid"
              }`}
              {...register("category.title")}
            />
            {errors?.category?.title?.message && (
              <span className="invalid-feedback">
                {errors?.category?.title?.message}
              </span>
            )}
          </div>
        </div>
        <div className="col-12 row mx-0 gap-2">
          <div className="col-12 col-sm">
            <label className="form-label">Why</label>
            <span className="row mx-0 gap-2">
              <div className="col m-0 p-0">
                <input
                  type="text"
                  className={`form-control ${
                    errors?.details?.why?.title && "is-invalid"
                  }`}
                  placeholder="Enter why title"
                  {...register("details.why.title")}
                />
                {errors?.details?.why?.title?.message && (
                  <span className="invalid-feedback">
                    {errors?.details?.why?.title?.message}
                  </span>
                )}
              </div>
              <div className="input-group p-0">
                <textarea
                  rows={3}
                  className={`form-control ${
                    errors?.details?.why?.description && "is-invalid"
                  }`}
                  placeholder="Enter why description"
                  {...register("details.why.description")}
                />
                <span className="px-2">
                  <button type="button" className="btn btn-success">
                    +
                  </button>
                </span>
                {errors?.details?.why?.description?.message && (
                  <span className="invalid-feedback">
                    {errors?.details?.why?.description?.message}
                  </span>
                )}
              </div>
            </span>
          </div>
          <div className="col-12 col-sm">
            <label className="form-label">What</label>
            <span className="row mx-0 gap-2">
              <div className="col m-0 p-0">
                <input
                  type="text"
                  className={`form-control ${
                    errors?.details?.what?.title && "is-invalid"
                  }`}
                  placeholder="Enter what title"
                  {...register("details.what.title")}
                />
                {errors?.details?.what?.title?.message && (
                  <span className="invalid-feedback">
                    {errors?.details?.what?.title?.message}
                  </span>
                )}
              </div>

              <div className="input-group p-0">
                <textarea
                  rows={3}
                  className={`form-control ${
                    errors?.details?.what?.description && "is-invalid"
                  }`}
                  placeholder="Enter what description"
                  {...register("details.what.description")}
                />
                <span className="px-2">
                  <button type="button" className="btn btn-success">
                    +
                  </button>
                </span>
                {errors?.details?.what?.description?.message && (
                  <span className="invalid-feedback">
                    {errors?.details?.what?.description?.message}
                  </span>
                )}
              </div>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddJobModal;
