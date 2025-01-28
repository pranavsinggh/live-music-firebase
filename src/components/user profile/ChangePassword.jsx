import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { __AUTH } from "../../backend/firebase";
import { updatePassword } from "firebase/auth";
import { IoEye, IoEyeOff } from "react-icons/io5";

const ChangePassword = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    password: "",
    confirm_password: "",
  });
  let [type, setType] = useState(false);

  let handleType = e => {
    setType(!type);
  };

  console.log(__AUTH.currentUser)

  const [loading, setLoading] = useState(false);

  let { password, confirm_password } = data;

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirm_password) {
      toast.error("Passwords does not match");
    } else {
      try {
        setLoading(true);
        await updatePassword(__AUTH.currentUser, password);
        console.log("Password updated successfully.");
        navigate("/user/profile");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <section>
      <article className="min-[100%-70px] bg-gray-850 flex flex-col justify-center py-12">
        <header>
          <h1 className="mt-10 text-center text-3xl leading-5 text-purple-600 max-w">
            Change Password
          </h1>
        </header>
        <main className="mt-8 m-auto">
          <form
            className="w-[400px] flex flex-col justify-center bg-gray-700 p-2 rounded-xl border-b-2 border-b-purple-700"
            onSubmit={handleSubmit}
          >
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
            <div className="p-2">
              <button className="bg-[#eb6378] w-full flex justify-center py-2 px-4 border-transparent text-md font-medium my-1 rounded-md text-white hover:bg-purple-600 focus:outline-none">
                Change Password
              </button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default ChangePassword;
