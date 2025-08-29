import type { RouteObject } from "react-router-dom";
import LoginPage from "../views/LoginPage";
import App from "../App";
import Layout from "../components/admin/Layout";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import StudentLayout from "../components/students/StudentLayout";
import Profile from "../components/admin/Profile/Profile";
import Contest from "../components/admin/Contest/Contest";
import Result from "../components/admin/Result/Result";
import StudentResult from "../components/students/Result/result";
import Registration from "../components/Login/Registration";
import StudentProfile from "../components/students/Profile/StudentProfile";
import ContestMain from "../components/students/contest/ContestMain";

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
            path: "",
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
            path: "profile",
            Component: StudentProfile,
          },
          {
            path: "contest",
            Component: ContestMain,
          },
          {},
          {
            path: "result",
            Component: StudentResult,
          },
        ],
      },
    ],
  },

];

export default routes;
