import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const test = () => {
    toast.success("Text toast!");
  };

  return (
    <nav className="d-flex align-items-center justify-content-between">
      <span className="p-2">Home</span>
      <div class="list-group list-group-horizontal border-0">
        <Link
          to="/"
          class="list-group-item list-group-item-action "
          aria-current="true"
          onClick={test}>
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
  );
};

export default Home;
