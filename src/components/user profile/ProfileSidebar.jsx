import React from "react";
import { NavLink } from "react-router-dom";
import { MdAccountBalanceWallet } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { ImProfile } from "react-icons/im";

const ProfileSidebar = () => {
  return (
    <aside className="w-[16%] h-[90.5vh] bg-slate-800 sticky top-[82px] min-w-[230px]">
      <nav className="flex flex-col justify-between h-full">
        <ul className="flex flex-col">
          <li>
            <NavLink
              to="/user/profile"
              end
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <MdAccountBalanceWallet />
              </span>
              <span>My Account</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile/add-profile-data"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <ImProfile />
              </span>
              <span>Upload profile data</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile/change-password"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <TbLockPassword />
              </span>
              <span>Change password</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile/upload-profile-photo"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <FaPhotoVideo />
              </span>
              <span>Upload Profile Photo</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile/settings"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <CiSettings />
              </span>
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
        <footer>
          <NavLink
            to="/user/profile/settings"
            className="flex gap-2 items-center p-3 mb-1 bg-red-600"
            // style={({ isActive }) => ({
            //   background: isActive && "#393f61a6",
            // })}
          >
            <span>Danger zone</span>
          </NavLink>
        </footer>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
