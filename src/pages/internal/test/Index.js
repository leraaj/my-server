import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "../../../hooks/useFetch";
import { getValue } from "@testing-library/user-event/dist/utils";

const JobForm = () => {
  const [page, setPage] = useState(0);

  const next = () => {
    setPage((prevPage) => (prevPage >= 3 ? 0 : prevPage + 1));
  };

  const back = () => {
    setPage((prevPage) => (prevPage <= 0 ? 3 : prevPage - 1));
  };

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(JobSchema),
    defaultValues: {
      title: "",
      category: "",
      details: {
        why: "",
        what: "",
        benefits: {
          pay: "",
          schedule: "",
        },
        responsibilities: [""],
        requirements: [""],
      },
    },
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

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ height: "100vh", overflow: "auto" }}>
      <div className="row mx-0 g-2">
        {page == 0 && (
          <>
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
          </>
        )}
        {/* LISTS */}
        {page == 1 && (
          <>
            <div className="row mx-0">
              <div className="row mx-0 g-2 col h-100">
                <label className="form-label">Responsibilities</label>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={() => appendResponsibility("")}>
                  Add Responsibility
                </button>
                {errors.details?.responsibilities ? (
                  <p className="text-danger">Required atleast one</p>
                ) : (
                  ""
                )}
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
                        {errors.details.responsibilities[index].message}
                      </p>
                    )}
                  </>
                ))}
              </div>
              <div className="row mx-0 g-2 col h-100">
                <label className="form-label">Requirements</label>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={() => appendRequirement("")}>
                  Add Requirement
                </button>
                {errors.details?.requirements ? (
                  <p className="text-danger">Required atleast one</p>
                ) : (
                  ""
                )}
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
                        {errors.details.requirements[index].message}
                      </p>
                    )}
                  </>
                ))}
              </div>
            </div>
          </>
        )}
        {/* BENEFITS */}
        {page == 2 && (
          <>
            <div className="col-12">
              <label className="form-label">Pay</label>
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
            <div className="col-12">
              <label className="form-label">Schedule</label>
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
          </>
        )}
        {/* SUBMIT BUTTON */}
        <div className="d-flex justify-content-between  col">
          <div className="col d-flex gap-2">
            <button
              className="btn btn-dark"
              disabled={page == 0}
              onClick={back}>
              back
            </button>
            <button
              className="btn btn-dark"
              disabled={page == 2}
              onClick={next}>
              next
            </button>
          </div>
          <button type="submit" disabled={page < 2} className="btn btn-dark">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobForm;
