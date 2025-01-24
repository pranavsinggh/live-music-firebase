import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { __AUTH } from "../../backend/firebase";
import { NavLink, useNavigate } from "react-router-dom";
import md5 from "md5";

const Register = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  let { username, email, password, confirm_password } = data;

  const [isLoading, setIsLoading] = useState(false);

  let [type, setType] = useState(false);

  let handleType = e => {
    setType(!type);
  };

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (password !== confirm_password) {
        toast.error("Passwords does not match");
      } else {
        let { user } = await createUserWithEmailAndPassword(
          __AUTH,
          email,
          password
        );
        await updateProfile(user, {
          displayName: username,
          photoURL: `https://gravatar.com/avatar/${md5(email)}?q=identicon`,
        });
        toast.success("Verification email sent");
        sendEmailVerification(user);
        toast.success("User registered");
        navigate("/auth/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <section>
      <article className="min-[100%-70px] bg-gray-850 flex flex-col justify-center">
        <header>
          <h1 className=" mt-12 text-center text-3xl leading-5 text-purple-600 max-w">
            Register
          </h1>
        </header>
        <main className="mt-8 m-auto">
          <form
            className="w-[400px] flex flex-col justify-center bg-gray-700 p-2 rounded-xl border-b-2 border-b-purple-700"
            onSubmit={handleSubmit}
          >
            <div className="p-2">
              <label
                htmlFor="username"
                className="block font-medium text-gray-100 leading-5 py-2 text-lg "
              >
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                id="username"
                name="username"
                className="w-full p-2 rounded-sm border-gray-500 border-2 bg-transparent focus:outline-none"
                value={username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="p-2">
              <label
                htmlFor="email"
                className="block font-medium text-gray-100 leading-5 py-2 text-lg "
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                id="email"
                name="email"
                className="w-full p-2 rounded-sm border-gray-500 border-2 bg-transparent"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="p-2 relative">
              <label
                htmlFor="password"
                className="block font-medium text-gray-100 leading-5 py-2 text-lg "
              >
                Password
              </label>
              <input
                type={type ? "text" : "password"}
                placeholder="Enter password"
                id="password"
                name="password"
                className="w-full p-2 rounded-sm border-gray-500 border-2 bg-transparent"
                value={password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-6 top-14 text-lg cursor-pointer"
                onClick={handleType}
              >
                {type ? <IoEyeOff /> : <IoEye />}
              </span>
            </div>
            <div className="p-2 relative">
              <label
                htmlFor="confirm_password"
                className="block font-medium text-gray-100 leading-5 py-2 text-lg "
              >
                Confirm Password
              </label>
              <input
                type={type ? "text" : "password"}
                placeholder="Confirm password"
                id="confirm_password"
                name="confirm_password"
                className="w-full p-2 rounded-sm border-gray-500 border-2 bg-transparent"
                value={confirm_password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-6 top-14 text-lg cursor-pointer"
                onClick={handleType}
              >
                {type ? <IoEyeOff /> : <IoEye />}
              </span>
            </div>
            <div className="p-2 flex gap-4 text-white text-md">
              <span>Already have an account ?</span>
              <span>
                <NavLink to="/auth/login">Login</NavLink>
              </span>
            </div>
            <div className="p-2">
              <button className="bg-[#eb6378] w-full flex justify-center py-2 px-4 border-transparent text-md font-medium my-1 rounded-md text-white hover:bg-purple-600 focus:outline-none">
                {isLoading ? "...Loading" : "Register"}
              </button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default Register;
