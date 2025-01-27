import React, { Fragment, useContext, useEffect, useState } from "react";
import Language from "./language.json";
import { AuthContextAPI } from "../../context/AuthContext";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { __DB } from "../../backend/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProfile = () => {
  const { authUser } = useContext(AuthContextAPI);
  let { uid } = authUser === null ? "" : authUser;

  let navigate = useNavigate();

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    adress: "",
    city: "",
    state: "",
    country: "",
    language: [],
    dob: "",
    age: "",
    phoneno: "",
    gender: "",
    isLoading: false,
  });

  useEffect(() => {
    let fetchProfile = async () => {
      onSnapshot(doc(__DB, "user_profile", authUser?.uid), data => {
        setData({ ...data.data() });
      });
    };
    fetchProfile();
  }, [uid]);
    
    console.log(data)

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" || type === "radio") {
      setData({
        ...data,
        [name]: checked ? value : "",
      });
    } else if (name === "language") {
      const selectedLanguages = Array.from(
        e.target.selectedOptions,
        option => option.value
      );
      setData({
        ...data,
        [name]: selectedLanguages,
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { photoURL, displayName, email, uid } = authUser;
    // const { uid } = authUser ? authUser.uid : "";
    setData({ ...data, isLoading: true });
    let payload = {
      firstname,
      lastname,
      adress,
      city,
      state,
      country,
      language,
      dob,
      age,
      phoneno,
      gender,
    };

    try {
      const user_profile_collection = doc(__DB, "user_profile", uid);
      await setDoc(user_profile_collection, {
        uid,
        email,
        displayName,
        photoURL,
        ...payload,
      });
      toast.success("User data added");
      navigate("/user/profile");
    } catch (error) {
      toast.error(error);
    }
  };

  let {
    firstname,
    lastname,
    adress,
    city,
    state,
    country,
    language,
    dob,
    age,
    phoneno,
    gender,
    isLoading,
  } = data;

  return (
    <section className="mt-[-5px]">
      <article className="max-w-4xl mx-auto bg-[#0F172A] px-8 py-4 rounded-2xl shadow-lg">
        <header className=" text-center">
          <h1 className="text-3xl font-semibold text-white mb-3">
            Upload Profile
          </h1>
        </header>
        <main>
          <form className="flex flex-col gap-[0.6rem]" onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-white font-medium mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-white font-medium mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Date of Birth and Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dob"
                  className="block text-white font-medium mb-2"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="age"
                  className="block text-white font-medium mb-2"
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={age}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Gender */}

            {/* Language and Phone Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Gender
                </label>
                <div className="flex gap-6 mt-0 text-white text-lg">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={handleChange}
                      className="text-blue-500"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={handleChange}
                      className="text-blue-500"
                    />
                    <span>Female</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={gender === "Other"}
                      onChange={handleChange}
                      className="text-blue-500"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>
              <div>
                <label
                  htmlFor="phoneno"
                  className="block text-white font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneno"
                  value={phoneno}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="adress"
                className="block text-white font-medium mb-2"
              >
                Address
              </label>
              <textarea
                name="adress"
                value={adress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
                placeholder="Street Address"
              ></textarea>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  className="p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                  className="p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={handleChange}
                  required
                  placeholder="Country"
                  className="p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="language"
                className="block text-white font-medium mb-2"
              >
                Language
              </label>
              <select
                name="language"
                value={language}
                onChange={handleChange}
                multiple
                className="w-full p-3 border border-gray-400 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none h-[100px]"
              >
                {Language.map(lang => (
                  <Fragment key={lang.code}>
                    <option value={lang.name}>{lang.name}</option>
                  </Fragment>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default AddProfile;
