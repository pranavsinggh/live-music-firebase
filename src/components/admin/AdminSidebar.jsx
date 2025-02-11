import React from "react";
import { NavLink } from "react-router-dom";
import { TbLockPassword } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import { IoMdAlbums } from "react-icons/io";

const AdminSidebar = () => {
  return (
    <aside className="w-[16%] h-[90vh] bg-slate-800 sticky top-[70px] min-w-[230px]">
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
              to="/admin/add-song"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <IoMdAlbums />
              </span>
              <span>Add song</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-trending-albums"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <IoMdAlbums />
              </span>
              <span>Add trending albums</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-trending-songs"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <IoMdAlbums />
              </span>
              <span>Add trending songs</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
