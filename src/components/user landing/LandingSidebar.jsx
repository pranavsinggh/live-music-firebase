import React from 'react'
import { RxDashboard } from 'react-icons/rx';
import { NavLink } from 'react-router-dom';

const LandingSidebar = () => {
  return (
    <aside className="w-[16%] h-[91vh] bg-slate-800 sticky top-[70px] min-w-[230px]">
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
         
        </ul>
      </nav>
    </aside>
  );
}

export default LandingSidebar