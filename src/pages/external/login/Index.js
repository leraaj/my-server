import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    login(data, setError);
  };
  return (
    <div style={{ height: "100vh", width: "100%", padding: 0, margin: 0 }}>
      <nav className="d-flex align-items-center justify-content-between">
        <span className="p-2">Login</span>
        <div class="list-group list-group-horizontal">
          <Link
            to="/"
            class="list-group-item list-group-item-action  "
            aria-current="true">
            home
          </Link>
          <Link to="/login" class="list-group-item list-group-item-action">
            login
          </Link>
          <Link to="/accounts" class="list-group-item list-group-item-action">
            Admin
          </Link>
          <Link to="/profile" class="list-group-item list-group-item-action">
            Employee
          </Link>
        </div>
      </nav>
      <div
        className="col-12 d-flex justify-content-center align-items-center"
        style={{ height: "calc(100% - 50px)", padding: 0, margin: 0 }}>
        <form
          className="col-10 col-sm-10 col-md-5 col-lg-4 m-0 p-0 needs-validation"
          onSubmit={handleSubmit(onSubmit)}
          noValidate>
          <div className="col row mx-0 gap-2">
            <div className="col-12">
              <span className="form-label ">Username</span>
              <input
                type="text"
                className={`form-control rounded-0 ${
                  errors.username && "is-invalid"
                }`}
                {...register("username")}
                required
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
            </div>
            <div className="col-12">
              <span className="form-label ">Password</span>
              <input
                type="password"
                className={`form-control rounded-0 ${
                  errors.password && "is-invalid"
                }`}
                {...register("password")}
                required
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
          </div>
          <div className="col d-flex justify-content-between py-2 gap-2">
            <button
              type="submit"
              className={`rounded-0 btn btn-${
                isLoading ? "secondary" : "success"
              } order-2 `}>
              {isLoading ? "Loading" : "Login"}
            </button>
            <button
              type="button"
              className="rounded-0 btn btn-outline-light order-1"
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
