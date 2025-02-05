import React, { useContext, useState } from "react";
import AllAlbums from "./AllAlbums";
import { AudioContext } from "../../context/AudioContextApi";
import Spinner from "../helpers/Spinner";
import TrendingSongs from "./TrendingSongs";

const LandingDashboard = () => {
  let { loading } = useContext(AudioContext);
  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <AllAlbums />
          <TrendingSongs />
        </>
      )}
    </section>
  );
};

export default LandingDashboard;
