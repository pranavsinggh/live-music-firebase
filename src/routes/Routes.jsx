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
import AdminRoutes from "./AdminRoutes";
import AdminContainer from "../components/admin/AdminContainer";
import AdminDashboard from "../components/admin/AdminDashboard";
import AddAlbum from "../components/admin/AddAlbum";
import LandingContainer from "../components/user landing/LandingContainer";
import LandingDashboard from "../components/user landing/LandingDashboard";
import NotFound from "../components/PageNotFound";
import AlbumDetails from "../components/user landing/AlbumDetails";
import AudioContextProvider from "../context/AudioContextApi";
import CustomAudioPlayerProvider from "../context/CustomAudioPlayerContext";
import Favourites from "../components/user landing/Favourites";
import Trending from "../components/user landing/Trending";
import Playlists from "../components/user landing/Playlists";
import AddTrendingAlbums from "../components/admin/AddTrendingAlbums";
import AddTrendingSongs from "../components/admin/AddTrendingSongs";
import AddSong from "../components/admin/AddSong";
import PlaylistDetails from "../components/user landing/PlaylistDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <AudioContextProvider>
            <CustomAudioPlayerProvider>
              <LandingContainer />
            </CustomAudioPlayerProvider>
          </AudioContextProvider>
        ),
        children: [
          {
            index: true,
            element: <LandingDashboard />,
          },
          {
            path: "album/:name",
            element: <AlbumDetails />,
          },
          {
            path: "trendings",
            element: <Trending />,
          },
          {
            path: "favourites",
            element: (
              <ProtectedRoutes>
                <Favourites />
              </ProtectedRoutes>
            ),
          },
          {
            path: "playlists",
            element: (
              <ProtectedRoutes>
                <Playlists />
              </ProtectedRoutes>
            ),
          },
          {
            path: "playlists/:id",
            element: (
              <ProtectedRoutes>
                <PlaylistDetails />
              </ProtectedRoutes>
            ),
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoutes>
            <AdminRoutes>
              <AdminContainer />
            </AdminRoutes>
          </ProtectedRoutes>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "add-album",
            element: <AddAlbum />,
          },
          {
            path: "add-song",
            element: <AddSong />,
          },
          {
            path: "add-trending-albums",
            element: <AddTrendingAlbums />,
          },
          {
            path: "add-trending-songs",
            element: <AddTrendingSongs />,
          },
        ],
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
      // {
      //   path: "/auth/phone",
      //   element: (
      //     <PublicRoutes>
      //       <PhoneAuth />
      //     </PublicRoutes>
      //   ),
      // },
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

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
