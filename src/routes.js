// Admin Routes
import Accounts from "./pages/internal/admin/accounts/Index";
import Applicants from "./pages/internal/admin/applicants/Index";
import Clients from "./pages/internal/admin/clients/Index";
import Posts from "./pages/internal/admin/posts/Index";
import Jobs from "./pages/internal/admin/jobs/Index";
import Chats from "./pages/internal/admin/chats/Index";
// Employee Routes
import Profile from "./pages/internal/employees/profile/Index";
import Orders from "./pages/internal/employees/orders/Index";
import MediaFiles from "./pages/internal/employees/mediaFiles/Index";
// TEST
import Test from "./pages/internal/test/Index";
import { Navigate } from "react-router-dom";

// Routes for admin
export const adminRoutes = [
  {
    isPrivate: true,
    path: "/accounts",
    element: <Accounts />,
  },
  {
    isPrivate: true,
    path: "/clients",
    element: <Clients />,
  },
  {
    isPrivate: true,
    path: "/applicants",
    element: <Applicants />,
  },
  {
    isPrivate: true,
    path: "/jobs",
    element: <Jobs />,
  },
  {
    isPrivate: true,
    path: "/posts",
    element: <Posts />,
  },
  {
    isPrivate: true,
    path: "/chats",
    element: <Chats />,
  },
  {
    isPrivate: false,
    path: "*",
    element: <Navigate to={"/login"} replace />,
  },
];

// Routes for applicants/clients users
export const employeeRoutes = [
  {
    isPrivate: true,
    path: "/profile",
    element: <Profile />,
  },
  {
    isPrivate: true,
    path: "/orders",
    element: <Orders />,
  },
  {
    isPrivate: true,
    path: "/media-files",
    element: <MediaFiles />,
  },
  {
    isPrivate: true,
    path: "/jobs",
    element: <>Jobs</>,
  },
  {
    isPrivate: true,
    path: "/chats",
    element: <>Chats</>,
  },
  {
    isPrivate: false,
    path: "*",
    element: <Navigate to={"/login"} replace />,
  },
];
