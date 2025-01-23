import { NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <aside>
      <nav>
        <ul className="flex gap-4">
          <li>
            <NavLink
              to="/"
              className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/auth/login"
              className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/auth/register"
              className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
            >
              Register
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Menu;
