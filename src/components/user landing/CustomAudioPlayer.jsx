import React, { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";

const CustomAudioPlayer = ({
  audioSrc,
  isPlaying,
  onPlayPause,
  handlePlay,
  length,
  index,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
    } else {
      audioRef.current.src = audioSrc;
    }

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);

    const setMetadata = () => {
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play();
      }
    };

    const handleSongEnd = () => {
      handleForward();
    };

    audio.addEventListener("loadedmetadata", setMetadata);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleSongEnd); // Auto-play next song

    return () => {
      audio.removeEventListener("loadedmetadata", setMetadata);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const handleSeekChange = e => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleForward = () => {
    if (index + 1 === length) {
      handlePlay(0);
    } else {
      handlePlay(index + 1);
    }
  };

  const handleBackward = () => {
    if (index === 0) {
      handlePlay(length - 1);
    } else {
      handlePlay(index - 1);
    }
  };

  return (
    <section className="h-[90px] w-full bg-slate-400">
      <article className="px-6 py-3">
        <header>
          <form className="flex items-center justify-center gap-8 text-lg">
            <span>
              {Math.floor(currentTime / 60)}:
              {String(Math.floor(currentTime % 60)).padStart(2, "0")}
            </span>
            <input
              type="range"
              className="w-full"
              min="0"
              max={duration || 1}
              value={currentTime}
              onChange={handleSeekChange}
            />
            <span>
              {Math.floor(duration / 60)}:
              {String(Math.floor(duration % 60)).padStart(2, "0")}
            </span>
          </form>
        </header>
        <main className="w-[30%] m-auto mt-3">
          <div className="flex justify-center gap-8 text-xl">
            <span onClick={handleBackward} className="cursor-pointer">
              <FaBackward />
            </span>
            <span onClick={onPlayPause} className="cursor-pointer">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </span>
            <span onClick={handleForward} className="cursor-pointer">
              <FaForward />
            </span>
          </div>
        </main>
      </article>
    </section>
  );
};

export default CustomAudioPlayer;
