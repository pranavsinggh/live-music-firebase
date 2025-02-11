import React, { useContext, useEffect, useState } from "react";
import AllAlbums from "./AllAlbums";
import { AudioContext } from "../../context/AudioContextApi";
import Spinner from "../helpers/Spinner";
import TrendingSongs from "./TrendingSongs";

const LandingDashboard = () => {
  let { loading, albums } = useContext(AudioContext);

  let [songs, setSongs] = useState([]);

  useEffect(() => {
    if (albums.length > 0) {
      const allSongs = albums.flatMap(album => album.songs || []);
      setSongs(allSongs);
    }
  }, [albums]);

  const shuffleSongs = () => {
    setSongs(prevSongs => {
      const shuffled = [...prevSongs].sort(() => Math.random() - 0.5);
      return shuffled;
    });
  };

  useEffect(() => {
    shuffleSongs();
  }, [albums]);

  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <AllAlbums albums={albums} display="Albums" />
          <TrendingSongs display="Trending songs" songs={songs} />
        </>
      )}
    </section>
  );
};

export default LandingDashboard;
