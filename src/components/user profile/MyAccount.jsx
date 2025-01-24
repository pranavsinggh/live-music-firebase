import React, { useContext } from "react";
import { AuthContextAPI } from "../../context/AuthContext";
import Spinner from "../helpers/Spinner";
import { TbPhotoEdit } from "react-icons/tb";
import { Link } from "react-router-dom";

const MyAccount = () => {
  let { authUser } = useContext(AuthContextAPI);
  console.log(authUser);
  return authUser === null ? (
    <Spinner />
  ) : (
    <section>
      <article className="flex flex-col max-w-2xl m-auto bg-slate-800 my-20 rounded-md min-h-96 items-center">
        <header className="flex flex-col w-full h-36 bg-purple-950 rounded-t-md justify-start items-center">
          <figure className="relative ">
            <Link to="/user/profile/upload-profile-photo">
              <TbPhotoEdit className="z-10 absolute right-[3px] bottom-[20px] text-3xl text-red-600 bg-white rounded-full" />
            </Link>
            <img
              src={authUser.photoURL}
              alt=""
              className="rounded-full w-28 mt-[-60px] mb-6"
            />
          </figure>
          <h2>{authUser?.displayName}</h2>
          <p>{authUser?.email}</p>
        </header>
      </article>
    </section>
  );
};

export default MyAccount;
