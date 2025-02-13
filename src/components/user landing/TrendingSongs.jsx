import React, { useContext, useEffect, useState } from "react";
import { AudioContext } from "../../context/AudioContextApi";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import SingleSong from "./SingleSong";

const TrendingSongs = ({ display, songs }) => {
  let { handlePlay, currentSong } = useContext(CustomAudioPlayerContextAPI);

  return (
    <aside className={`${currentSong != null ? "mb-[180px]" : ""}`}>
      <h1 className="text-2xl p-2 mb-2">{display}</h1>
      <main className="flex gap-6 flex-wrap">
        {songs?.map((song, index) => (
          <SingleSong song={song} index={index} songs={songs} key={index} />
        ))}
      </main>
    </aside>
  );
};

export default TrendingSongs;
