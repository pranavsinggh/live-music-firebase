import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { __AUTH } from "../../backend/firebase";

const Login = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  let { email, password } = data;

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
      let data = await signInWithEmailAndPassword(__AUTH, email, password);
      console.log(data);
      if (data.user.emailVerified === true) {
        toast.success("User logged in");
        navigate("/");
      } else {
        toast.error("Verify your email");
        sendEmailVerification(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <section>
      <article className="min-[100%-70px] bg-gray-850 flex flex-col justify-center py-12">
        <header>
          <h1 className="mt-10 text-center text-3xl leading-5 text-purple-600 max-w">
            Login
          </h1>
        </header>
        <main className="mt-8 m-auto">
          <form
            className="w-[400px] flex flex-col justify-center bg-gray-700 p-2 rounded-xl border-b-2 border-b-purple-700"
            onSubmit={handleSubmit}
          >
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
            <div className="p-2 flex gap-4 text-white text-md">
              <span className="text-sm font-thin">Forgotten password ? </span>
              <span>
                <NavLink
                  to="/auth/resetpassword"
                  className="text-white text-sm font-thin bg-slate-500 rounded-sm hover:bg-pink-700 border-purple-700 border-b p-2 hover:border-pink-500"
                >
                  Reset password
                </NavLink>
              </span>
            </div>
            <div className="p-2 flex gap-4 text-white text-md">
              <span className="text-sm font-thin">Dont have an account ?</span>
              <span>
                <NavLink to="/auth/register" className="text-sm font-thin">
                  Register
                </NavLink>
              </span>
            </div>
            <div className="p-2">
              <button className="bg-[#eb6378] w-full flex justify-center py-2 px-4 border-transparent text-md font-medium my-1 rounded-md text-white hover:bg-purple-600 focus:outline-none">
                {isLoading ? "...Loading" : "Login"}
              </button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default Login;
