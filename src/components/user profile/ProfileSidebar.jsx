import React from "react";
import { NavLink } from "react-router-dom";
import { MdAccountBalanceWallet } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";

const ProfileSidebar = () => {
  return (
    <aside className="basis-[16%] h-[90vh] bg-slate-800">
      <nav>
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
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
