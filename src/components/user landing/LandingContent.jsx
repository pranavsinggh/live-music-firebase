import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import CustomAudioPlayer from "./CustomAudioPlayer";

const LandingContent = () => {
  let { audio, playing, setPlaying, handlePlay, songs, currentSong, song } =
    useContext(CustomAudioPlayerContextAPI);
  return (
    <>
      <Outlet />
      <footer
        className={`fixed left-2 rounded-lg overflow-hidden bottom-2 z-40 w-[99%] ${
          (currentSong === null || currentSong === undefined) && "hidden"
        }`}
      >
        <h1 className="text-white text-lg font-semibold text-center truncate px-4 py-2 bg-slate-600">
          {song?.name || "No song playing"}
        </h1>
        <CustomAudioPlayer
          songs={songs}
          audioSrc={audio} // Ensure you're passing the correct audio source
          isPlaying={playing}
          onPlayPause={() => setPlaying(!playing)}
          handlePlay={handlePlay} // Ensure you're passing the correct function
          length={songs.length}
          index={currentSong}
        />
      </footer>
    </>
  );
};

export default LandingContent;
