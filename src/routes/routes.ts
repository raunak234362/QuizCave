import type { RouteObject } from "react-router-dom";
import LoginPage from "../views/LoginPage";
import App from "../App";
import Layout from "../components/admin/Layout";
import StudentDashboard from "../components/students/StudentDashboard/Dashboard";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import StudentLayout from "../components/students/StudentLayout";
import Profile from "../components/admin/Profile/Profile";
import Contest from "../components/admin/Contest/Contest";
import Result from "../components/admin/Result/Result";
import Registration from "../components/Login/Registration";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/registration",
    Component: Registration,
  },
  {
    path: "dashboard",
    Component: App,
    children: [
      {
        path: "admin",
        Component: Layout,
        children: [
          {
            path: "dashboard",
            Component: Dashboard,
          },
          {
            path: "contest",
            Component: Contest,
          },
          {
            path: "result",
            Component: Result,
          },
          {
            path: "profile",
            Component: Profile,
          },
        ],
      },
      {
        path: "student",
        Component: StudentLayout,
        children: [
          {
            path: "dashboard",
            Component: StudentDashboard,
          },
        ],
      },
    ],
  },
];

export default routes;
