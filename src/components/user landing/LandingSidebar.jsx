import React from "react";
import { FaFire, FaHeart } from "react-icons/fa";
import { PiPlaylistFill } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";

const LandingSidebar = () => {
  return (
    <aside className="w-[230px] h-[90.5vh] bg-slate-800 sticky top-[71px] z-[1]">
      <nav className="flex flex-col justify-between h-full">
        <ul className="flex flex-col">
          <li>
            <NavLink
              to="/"
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
              to="/trendings"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <FaFire />
              </span>
              <span>Trending</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favourites"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <FaHeart />
              </span>
              <span>Favourites</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/playlists"
              className="flex gap-2 items-center p-3 mb-1"
              style={({ isActive }) => ({
                background: isActive && "#393f61a6",
              })}
            >
              <span className="text-slate-400 text-2xl">
                <PiPlaylistFill />
              </span>
              <span>Playlists</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default LandingSidebar;
