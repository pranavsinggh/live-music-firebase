import React, { useContext, useState } from "react";
import AllAlbums from "./AllAlbums";
import { AudioContext } from "../../context/AudioContextApi";
import Spinner from "../helpers/Spinner";
import TrendingSongs from "./TrendingSongs";
import CustomAudioPlayer from "./CustomAudioPlayer";

const LandingDashboard = () => {
  let { loading } = useContext(AudioContext);

  let [songs, setSongs] = useState([]);
  const [audio, setAudio] = useState("");
  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <AllAlbums />
          <TrendingSongs {...{ songs, setSongs, audio, setAudio }} />
          <CustomAudioPlayer />
        </>
      )}
    </section>
  );
};

export default LandingDashboard;
