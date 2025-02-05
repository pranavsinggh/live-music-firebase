import React, { useContext, useEffect, useState } from "react";
import { AudioContext } from "../../context/AudioContextApi";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";

const TrendingSongs = () => {
  let { albums } = useContext(AudioContext);
  let { handlePlay, currentSong, setType } = useContext(
    CustomAudioPlayerContextAPI
  );
  let [songs, setSongs] = useState();

  useEffect(() => {
    if (albums.length > 0) {
      const allSongs = albums.flatMap(album => album.songs || []);
      setSongs(allSongs);
    }
    setType("song");
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
    <aside className={`${currentSong != null ? "mb-[180px]" : ""}`}>
      <h1 className="text-2xl p-2 mb-2">Trending songs</h1>
      <main className="flex gap-6 flex-wrap">
        {songs?.map((song, index) => (
          <div
            className="basis-[200px] mt-2 bg-slate-900 rounded-md hover:scale-105 transition-all"
            key={song.id || index}
            onClick={() => handlePlay(index, songs)}
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
    </aside>
  );
};

export default TrendingSongs;
