import React, { useContext, useEffect, useState } from "react";
import AllAlbums from "./AllAlbums";
import { AudioContext } from "../../context/AudioContextApi";
import Spinner from "../helpers/Spinner";
import TrendingSongs from "./TrendingSongs";

const LandingDashboard = () => {
  let { loading, albums, allSongs } = useContext(AudioContext);

  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <AllAlbums albums={albums} display="Albums" />
          <TrendingSongs display="Songs" songs={allSongs} />
        </>
      )}
    </section>
  );
};

export default LandingDashboard;
