import React from "react";
import { NavLink } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import { IoMdAlbums } from "react-icons/io";

const AdminSidebar = () => {
  return (
    <aside className="w-[16%] h-[91vh] bg-slate-800 sticky top-[70px] min-w-[230px]">
      <nav className="flex flex-col justify-between h-full">
        <ul className="flex flex-col">
          <li>
            <NavLink
              to="/admin"
              end
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <RxDashboard />
              </span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-album"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <IoMdAlbums />
              </span>
              <span>Add album</span>
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

export default AdminSidebar;
