import React, { useEffect, useRef, useState } from "react";
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaVolumeUp,
  FaVolumeMute,
  FaRedo,
} from "react-icons/fa";
import { ImLoop2 } from "react-icons/im";

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
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

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
    audio.addEventListener("ended", handleSongEnd);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  return (
    <section className="w-full bg-slate-400 mx-auto  text-white rounded-b-lg shadow-lg p-4 h-[100px]">
      {/* Progress Bar */}
      <header>
        <div className="flex items-center justify-between text-lg">
          <span>
            {Math.floor(currentTime / 60)}:
            {String(Math.floor(currentTime % 60)).padStart(2, "0")}
          </span>
          <input
            type="range"
            className="w-full mx-3 "
            min="0"
            max={duration || 1}
            value={currentTime}
            onChange={handleSeekChange}
          />
          <span>
            {Math.floor(duration / 60)}:
            {String(Math.floor(duration % 60)).padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* Playback Controls */}
      <main className="flex justify-end gap-3 mt-3">
        <div className="flex justify-between items-center w-[54%]">
          <div className="flex justify-self-center justify-center gap-6 text-2xl ">
            <button onClick={handleBackward}>
              <FaBackward />
            </button>
            <button onClick={onPlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleForward}>
              <FaForward />
            </button>
          </div>

          {/* Volume and Playback Speed */}
          <div className="flex items-center gap-4 text-lg">
            <button onClick={toggleLoop}>
              {!isLooping ? <FaRedo /> : <ImLoop2 />}
            </button>
            {/* Volume */}
            <button onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              className="w-24 "
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
            />

            {/* Playback Speed */}
            <select
              className="bg-transparent text-white p-1 rounded focus:outline-none focus:border-none text-end"
              value={playbackRate}
              onChange={e => setPlaybackRate(parseFloat(e.target.value))}
            >
              <option value="0.5" className="text-black text-left">
                0.5x
              </option>
              <option value="1" className="text-black text-left">
                1x
              </option>
              <option value="1.5" className="text-black text-left">
                1.5x
              </option>
              <option value="2" className="text-black text-left">
                2x
              </option>
            </select>
          </div>
        </div>
      </main>
    </section>
  );
};

export default CustomAudioPlayer;
