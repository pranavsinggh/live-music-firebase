import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import ProfileContainer from "../components/user profile/ProfileContainer";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import ResetPassword from "../components/auth/ResetPassword";
import MyAccount from "../components/user profile/MyAccount";
import ChangePassword from "../components/user profile/ChangePassword";
import UploadProfilePhoto from "../components/user profile/UploadProfilePhoto";
import Settings from "../components/user profile/Settings";
import AddProfile from "../components/user profile/AddProfile";

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
        children: [
          {
            index: true,
            element: (
              <ProtectedRoutes>
                <MyAccount />
              </ProtectedRoutes>
            ),
          },
          {
            path: "add-profile-data",
            element: (
              <ProtectedRoutes>
                <AddProfile />
              </ProtectedRoutes>
            ),
          },
          {
            path: "change-password",
            element: (
              <ProtectedRoutes>
                <ChangePassword />
              </ProtectedRoutes>
            ),
          },
          {
            path: "upload-profile-photo",
            element: (
              <ProtectedRoutes>
                <UploadProfilePhoto />
              </ProtectedRoutes>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoutes>
                <Settings />
              </ProtectedRoutes>
            ),
          },
        ],
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
        path: "/auth/resetpassword",
        element: (
          <PublicRoutes>
            <ResetPassword />
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
