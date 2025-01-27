import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContextAPI } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { __AUTH } from "../../backend/firebase";
import toast from "react-hot-toast";

const Menu = () => {
  let { authUser } = useContext(AuthContextAPI);

  const logout = async () => {
    try {
      await signOut(__AUTH);
      // window.localStorage.removeItem("TOKEN");
      toast.success("User logged out");
      window.location.assign("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  let AnonymousUser = () => {
    return (
      <>
        <li>
          <NavLink
            to="/auth/login"
            style={({ isActive }) => ({
              background: isActive ? "#6b21a8" : "",
            })}
            className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/auth/register"
            style={({ isActive }) => ({
              background: isActive ? "#6b21a8" : "",
            })}
            className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
          >
            Register
          </NavLink>
        </li>
      </>
    );
  };

  let AuthenticatedUser = () => {
    return (
      <>
        <li>
          <NavLink
            to="/user/profile"
            style={({ isActive }) => ({
              background: isActive ? "#6b21a8" : "",
            })}
            className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-1  font-semibold pointer-events-auto rounded-md flex items-center justify-center gap-2"
          >
            <span>{authUser.displayName}</span>
            <span>
              {" "}
              <img
                src={authUser.photoURL}
                alt=""
                className="w-[40px] h-[40px] rounded-full"
              />
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
            onClick={logout}
          >
            Logout
          </NavLink>
        </li>
      </>
    );
  };
  return (
    <aside>
      <nav>
        <ul className="flex gap-4 items-center">
          <li>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                background: isActive ? "#6b21a8" : "",
              })}
              className="text-white active:bg-[#4a3e60cc] hover:bg-purple-800 px-5 py-3 font-semibold pointer-events-auto rounded-md"
            >
              Home
            </NavLink>
          </li>
          {authUser ? <AuthenticatedUser /> : <AnonymousUser />}
        </ul>
      </nav>
    </aside>
  );
};

export default Menu;
