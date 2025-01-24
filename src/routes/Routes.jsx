import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import ProfileContainer from "../components/user profile/ProfileContainer";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1>Home page</h1>,
      },
      {
        path: "/user/profile",
        element: (
          <ProtectedRoutes>
            <ProfileContainer />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        ),
      },
      {
        path: "/auth/register",
        element: (
          <PublicRoutes>
            <Register />
          </PublicRoutes>
        ),
      },
    ],
  },
]);

export default router;
