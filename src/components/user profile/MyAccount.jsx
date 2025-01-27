import React, { useContext, useEffect, useState } from "react";
import { AuthContextAPI } from "../../context/AuthContext";
import Spinner from "../helpers/Spinner";
import { TbPhotoEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { __DB } from "../../backend/firebase";

const MyAccount = () => {
  let { authUser } = useContext(AuthContextAPI);
  const [profile, setProfile] = useState(null); // Use null to signify data is still loading
  const [loading, setLoading] = useState(true); // To track loading state

  let { uid } = authUser === null ? "" : authUser;

  useEffect(() => {
    const fetchProfile = async () => {
      onSnapshot(doc(__DB, "user_profile", authUser?.uid), data => {
        setProfile(data.data());
        setLoading(false); // Once data is loaded, set loading to false
      });
    };
    fetchProfile();
  }, [uid, authUser]);

  if (loading) {
    // Show nothing or a loader until profile data is loaded
    return <Spinner />;
  }

  return authUser === null ? (
    <Spinner />
  ) : (
    <section className="bg-gradient-to-b from-indigo-900 to-purple-800 h-[90vh] flex items-center justify-center">
      <article className="flex flex-col max-w-3xl w-full m-auto bg-gradient-to-b from-slate-800 to-slate-900 scale-[0.93] rounded-xl shadow-2xl px-8 py-6">
        <header className="flex flex-col w-full h-48 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl justify-center items-center text-center relative">
          <Link to="/user/profile/upload-profile-photo">
            <TbPhotoEdit className="absolute right-[295px] top-[55px] text-4xl text-red-500 bg-black rounded-full p-2 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out" />
          </Link>
          <img
            src={authUser?.photoURL}
            alt="Profile"
            className="rounded-full w-32 h-32 border-4 border-white -mt-16 mb-4 shadow-lg"
          />
          <h2 className="text-3xl font-semibold text-white">
            {authUser?.displayName}
          </h2>
          <p className="text-sm text-gray-300">{authUser?.email}</p>
        </header>

        <main className="text-white mt-5 min-h-[400px]">
          {profile ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-indigo-300">
                  Personal Info
                </h2>
                <div className="text-center">
                  <Link
                    to="/user/profile/add-profile-data"
                    className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 transition duration-300"
                  >
                    Edit Profile Data
                  </Link>
                </div>
              </div>
              {/* Display Profile Data */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-4 bg-slate-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Phone Number
                  </h3>
                  <p className="text-xl">{profile?.phoneno}</p>
                </div>

                <div className="p-4 bg-slate-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Gender
                  </h3>
                  <p className="text-xl">{profile?.gender}</p>
                </div>

                <div className="p-4 bg-slate-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Date of Birth
                  </h3>
                  <p className="text-xl">{profile?.dob}</p>
                </div>

                <div className="p-4 bg-slate-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-lg font-semibold text-indigo-400">Age</h3>
                  <p className="text-xl">{profile?.age}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 mt-6">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Address
                </h3>
                <p className="text-xl">
                  {profile?.adress}, {profile?.city}, {profile?.state},{" "}
                  {profile?.country}
                </p>
              </div>

              <div className="mt-6 p-4 bg-slate-700 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Languages
                </h3>
                <ul className="list-disc pl-5 flex gap-8">
                  {profile?.language && profile?.language.length > 0 ? (
                    profile?.language.map((lang, index) => (
                      <li key={index} className="text-xl ">
                        {lang}
                      </li>
                    ))
                  ) : (
                    <p className="text-xl">No languages specified.</p>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-col h-[300px]">
              {/* Add Profile Data Button if Profile is Empty */}
              <h1 className="text-xl font-semibold text-white">
                User data not added yet.
              </h1>
              <p className="text-sm text-gray-400 mt-4">
                Please add your profile data to complete your account.
              </p>
              <Link
                to="/user/profile/add-profile-data"
                className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition duration-300"
              >
                Add Profile Data
              </Link>
            </div>
          )}
        </main>
      </article>
    </section>
  );
};

export default MyAccount;
