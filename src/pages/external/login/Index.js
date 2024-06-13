import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../../hooks/useLogin";
const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();
  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });
  const {
    register,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    login(data, setError);
  };
  const CheckFieldValue = (value) => {
    const valid = useWatch({
      control,
      name: `${value}`,
    });
    return valid ? "is-valid" : "";
  };
  return (
    <div className="landing-section d-flex justify-content-center ">
      <div className="col-md-8 col-12" style={{ paddingTop: "80px" }}>
        <span className="bar-title" style={{ paddingBottom: "3rem" }}>
          sign in
          <br />
          your account
        </span>
        <form
          className=" needs-validation"
          onSubmit={handleSubmit(onSubmit)}
          noValidate>
          <div className="col row mx-0 g-3">
            <div className="col-12 col-md input-container">
              <span className="form-label-light ">Username</span>
              <input
                type="text"
                className={`form-control form-control-light ${
                  errors.username ? "is-invalid" : ""
                } ${CheckFieldValue("username")}`}
                {...register("username")}
                required
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="col-12 col-md input-container">
              <span className="form-label-light ">Password</span>
              <input
                type="password"
                className={`form-control form-control-light ${
                  errors.password ? "is-invalid" : ""
                } ${CheckFieldValue("password")}`}
                {...register("password")}
                required
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
          </div>
          <div className="col d-flex justify-content-between py-5 ">
            <button
              type="submit"
              className={`primary-btn btn-${
                isLoading ? "secondary" : "success"
              } order-2 `}>
              {isLoading ? "Loading" : "Login"}
            </button>
            <button
              type="button"
              className="secondary-btn order-1"
              onClick={() => navigate("/")}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
