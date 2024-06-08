import React, { useEffect } from "react";
import Modal from "../../../../components/modal/Modal";
import { toast } from "sonner";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useFetch from "../../../../hooks/useFetch";
import { getValue } from "@testing-library/user-event/dist/utils";

const UpdateModal = ({ show, onHide, refresh, selectedJob }) => {
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
    getValues,
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
  useEffect(() => {
    if (selectedJob) {
      reset({
        title: selectedJob?.title || "",
        category: selectedJob?.categoryId || "",
        details: {
          why: selectedJob?.why || "",
          what: selectedJob?.what || "",
          benefits: {
            pay: selectedJob?.benefitsPay || "",
            schedule: selectedJob?.benefitsSchedule || "",
          },
          responsibilities: selectedJob?.responsibilities || [""],
          requirements: selectedJob?.requirements || [""],
        },
      });
    }
    console.table(selectedJob);
  }, [selectedJob, reset]);
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
            "Conflict: There is a conflict with the current state of the resource."
          );
          fnResponse.duplicates.forEach((fieldError) => {
            setError(fieldError, {
              type: "duplicated",
              message: `This field already exists`,
            });
          });
        } else {
          toast.error(response.statusText);
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const onClose = () => {
    onHide();
  };

  const submitComplete = () => {
    onClose();
    refresh();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      title="View Job Information"
      size="fullscreen"
      onSubmit={handleSubmit(onSubmit)}
      isStatic>
      <div className="row mx-0 g-2 col">
        {/* <div class="input-group mb-2">
          <span class="input-group-text" id="basic-addon1">
            Title
          </span>
          <input
            className={`form-control ${errors.title && "is-invalid"}`}
            placeholder="Enter title"
            disabled
            {...register("title")}
          />
          {errors.title && (
            <span className="invalid-feedback">{errors.title.message}</span>
          )}
        </div> */}
        {/* <div class="input-group mb-2">
          <span class="input-group-text" id="basic-addon1">
            Category
          </span>
          <select
            className={`form-select ${errors.category && "is-invalid"}`}
            disabled
            {...register("category")}>
            <option value="">Select a category</option>
            {categoryData?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="invalid-feedback">{errors.category.message}</span>
          )}
        </div> */}
        <div class="col">
          <span class="form-label fw-bold">
            {`Why become a  ${getValues("title") || "..."}? (${
              selectedJob?.categoryTitle
            })  `}
          </span>
          <p>{getValues("details.why")}</p>
        </div>
        <div class="col">
          <span class="form-label fw-bold">
            {`What does the role require?`}
          </span>
          <p>{getValues("details.what")}</p>
        </div>
        {/* BENEFITS */}
        <div className="col-12">
          <div className="d-flex gap-2">
            <div class="input-group mb-2">
              <span class="input-group-text" id="basic-addon1">
                Pay
              </span>
              <input
                className={`form-control ${
                  errors.details?.benefits.pay && "is-invalid"
                }`}
                placeholder="Pay"
                disabled
                {...register("details.benefits.pay")}
              />
              {errors.details?.benefits?.pay && (
                <div className="invalid-feedback">
                  {errors.details.benefits.pay.message}
                </div>
              )}
            </div>
            <div class="input-group mb-2">
              <span class="input-group-text" id="basic-addon1">
                Schedule
              </span>
              <input
                className={`form-control ${
                  errors.details?.benefits.schedule && "is-invalid"
                }`}
                placeholder="Schedule"
                disabled
                {...register("details.benefits.schedule")}
              />
              {errors.details?.benefits?.schedule && (
                <div className="invalid-feedback">
                  {errors.details.benefits.schedule.message}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* LISTS */}
        <div className="d-flex gap-2 m-0 p-0 my-3 ">
          <div className={`card p-2`}>
            <div className="card-header">
              <label className="col form-label">Responsibilities</label>
            </div>
            <div className="card-body">
              <ol className=" ">
                {responsibilityFields.map((field, index) => (
                  <li key={field.id} className=" pb-2">
                    {getValues(`details.responsibilities.${index}`)}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className={`card p-2`}>
            <div className="card-header">
              <label className="col form-label">Responsibilities</label>
            </div>
            <div className="card-body">
              <ol className=" ">
                {requirementFields.map((field, index) => (
                  <li key={field.id} className=" pb-2">
                    {getValues(`details.requirements.${index}`)}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;
