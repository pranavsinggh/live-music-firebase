import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import { IoClose } from "react-icons/io5";
import CustomAudioPlayer from "react-audio-pro-player";

const LandingContent = () => {
  let {
    audio,
    playing,
    setPlaying,
    handlePlay,
    songs,
    currentSong,
    song,
    handleClose,
  } = useContext(CustomAudioPlayerContextAPI);

  console.log(song);
  return (
    <>
      <Outlet />
      <footer
        className={`fixed left-2 rounded-lg overflow-hidden bottom-2 z-40 w-[99%] ${
          (currentSong === null || currentSong === undefined) && "hidden"
        }`}
      >
        <div className="flex items-center w-full bg-slate-600 px-4 py-2 justify-between">
          <h1 className="text-white text-lg font-semibold flex-grow text-center">
            {song?.name || "No song playing"}
          </h1>
          <span className="ml-auto cursor-pointer" onClick={handleClose}>
            <IoClose className="text-white text-2xl font-[900]" />
          </span>
        </div>

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
