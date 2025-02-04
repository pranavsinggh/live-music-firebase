import React, { useContext, useEffect, useState } from "react";
import { AudioContext } from "../../context/AudioContextApi";
import CustomAudioPlayer from "./CustomAudioPlayer";

const TrendingSongs = ({ songs, setSongs, audio, setAudio }) => {
  console.log(songs, setSongs);
  let { albums } = useContext(AudioContext);
  // const [songs, setSongs] = useState([]);

  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    if (albums.length > 0) {
      const allSongs = albums.flatMap(album => album.songs || []);
      setSongs(allSongs);
    }
  }, [albums]);

  const handlePlay = index => {
    setAudio(songs[index]?.src);
    setCurrentSong(index);
    setPlaying(true);
  };

  const shuffleSongs = () => {
    setSongs(prevSongs => {
      const shuffled = [...prevSongs].sort(() => Math.random() - 0.5);
      return shuffled;
    });
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    //   shuffleSongs();
    // }, 5000);

    // return () => clearInterval(interval);

    shuffleSongs();
  }, [albums]);
  return (
    <aside className="mb-[150px]">
      <h1 className="text-2xl p-2 mb-2">Trending songs</h1>
      <main className="flex gap-6 flex-wrap">
        {songs?.map((song, index) => (
          <div
            className="basis-[200px] mt-2 bg-slate-900 rounded-md hover:scale-105 transition-all"
            key={song.id || index}
            onClick={() => handlePlay(index)}
          >
            <figure>
              <img
                src={song.thumbnail}
                alt=""
                className="h-[120px] w-full rounded-t-md object-cover"
              />
            </figure>
            <main className="py-2 px-2 text-sm">
              <h1>
                {song.name.length > 15
                  ? song.name.slice(0, 15) + "..."
                  : song.name}
              </h1>
            </main>
          </div>
        ))}
      </main>
      <footer
        className={`fixed left-2 rounded-lg overflow-hidden bottom-2 z-40 w-[99%] ${
          currentSong === null && "hidden"
        }`}
      >
        <h1 className="text-white text-lg font-semibold text-center truncate px-4 py-2 bg-slate-900">
          {/* {songs[currentSong]?.name || "No song playing"} */}
        </h1>
        <CustomAudioPlayer
          audioSrc={audio}
          isPlaying={playing}
          onPlayPause={() => setPlaying(!playing)}
          handlePlay={handlePlay}
          length={songs?.length}
          index={currentSong}
        />
      </footer>
    </aside>
  );
};

export default TrendingSongs;
