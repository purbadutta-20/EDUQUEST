import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Lesson } from "./pages/Lesson";
import { Leaderboard } from "./pages/Leaderboard";
import { Achievements } from "./pages/Achievements";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, Component: Dashboard },
      { path: "courses", Component: Courses },
      { path: "lesson/:courseId/:lessonId", Component: Lesson },
      { path: "leaderboard", Component: Leaderboard },
      { path: "achievements", Component: Achievements },
    ],
  },
]);