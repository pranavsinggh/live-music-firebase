import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AlbumDetail from "./AlbumDetail";
import { FaPlay, FaPause } from "react-icons/fa";
import { AuthContextAPI } from "../../context/AuthContext";
import toast from "react-hot-toast";
import CustomAudioPlayer from "./CustomAudioPlayer";

const AlbumDetails = () => {
  let { state } = useLocation();
  let { authUser } = useContext(AuthContextAPI);

  let [musicDirector, setMusicDirector] = useState("");
  let [lyricist, setLyricist] = useState("");
  let [actors, setActors] = useState("");
  let [singers, setSingers] = useState("");
  let [director, setDirector] = useState("");

  useEffect(() => {
    if (state?.songs) {
      let newMusicDirectors = new Set();
      let newDirectors = new Set();
      let newLyricists = new Set();
      let newActors = new Set();
      let newSingers = new Set();

      state.songs.forEach(song => {
        if (song.artists) {
          if (song.artists.musicDirector) {
            newMusicDirectors.add(song.artists.musicDirector);
          }
          if (song.artists.director) {
            newDirectors.add(song.artists.director);
          }
          song.artists.lyricists?.forEach(lyr => newLyricists.add(lyr));
          song.artists.actors?.forEach(act => newActors.add(act));
          song.artists.singers?.forEach(sing => newSingers.add(sing));
        }
      });

      setMusicDirector(Array.from(newMusicDirectors).join(", "));
      setDirector(Array.from(newDirectors).join(", "));
      setLyricist(Array.from(newLyricists).join(", "));
      setActors(Array.from(newActors).join(", "));
      setSingers(Array.from(newSingers).join(", "));
    }
  }, [state]);

  let [playing, setPlaying] = useState(false);
  let [currentSong, setCurrentSong] = useState();
  let [audio, setAudio] = useState("");

  const handlePlay = index => {
    if (authUser !== null || index < 2) {
      if (currentSong === index) {
        setPlaying(!playing);
      } else {
        setAudio(state.songs[index].src);
        setCurrentSong(index);
        setPlaying(true);
      }
    } else {
      toast.error("Login to listen to other songs");
    }
  };

  return (
    <section className="p-3 w-full">
      <article>
        <aside className="flex gap-10 ">
          <div className="basis-[30%]">
            <figure className="py-3 relative">
              <img src={state.poster} alt="" className="rounded-lg w-full " />
              <span className="absolute top-0 right-0 px-3 py-1 bg-pink-500 rounded-md text-[12px]">
                {state.language}
              </span>
            </figure>
          </div>
          <div className="basis-[70%] py-2">
            <h1 className="text-2xl font-thin ">
              <span>{state.title}</span>
              <span className="text-right mx-10 font-thin text-[13px] bg-purple-700 text-white rounded-lg px-2 py-1">
                Number of tracks{" "}
                <span className="text-[14px] px-2 font-bold">
                  {state.songs.length}
                </span>
              </span>
            </h1>
            <ul className="flex flex-col py-[10px] leading-9">
              <AlbumDetail field="Music Directors" data={musicDirector} />
              <AlbumDetail field="Lyricists" data={lyricist} />
              <AlbumDetail field="Actors" data={actors} />
              <AlbumDetail field="Singers" data={singers} />
              <AlbumDetail field="Director" data={director} />
              <AlbumDetail field="Release data" data={state.date} />
              <AlbumDetail field="Language" data={state.language} />
              <AlbumDetail field="Genre" data={state.albumType} />
              <AlbumDetail field="Description" data={state.description} />
            </ul>
          </div>
        </aside>
        <main className="mt-4 p-5 flex flex-col gap-4 bg-slate-900 rounded-lg mb-24">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="uppercase bg-slate-600 text-white w-full ">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-6 py-3">Track</th>
                <th className="px-6 py-3">Song Name</th>
                <th className="px-6 py-3">Artists</th>
                <th className="px-6 py-3">Music Director</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3 w-[70px]"></th>
              </tr>
            </thead>
            <tbody>
              {state.songs.map((song, index) => {
                return (
                  <tr
                    key={song.id}
                    className={`border-b border-slate-400  text-slate-400 transition-all cursor-pointer ${
                      currentSong === index && "bg-purple-900 text-white"
                    }  ${
                      authUser === null &&
                      index > 1 &&
                      "bg-[#62676A] text-black cursor-not-allowed"
                    }`}
                    onClick={() => handlePlay(index)}
                  >
                    <td className="py-2">
                      <div className="flex justify-center items-center">
                        {index + 1}
                      </div>
                    </td>
                    <td className="relative  py-2">
                      <span className="absolute top-7 text-white  left-11">
                        {currentSong === index && playing ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </span>
                      <img
                        src={song.thumbnail}
                        alt=""
                        className="h-14 w-18 rounded-lg"
                      />
                    </td>
                    <td className="py-2">{song.name}</td>
                    <td className="py-2">
                      {song.artists.singers + "," + song.artists.actors}
                    </td>
                    <td className="py-2 px-6">{song.artists.musicDirector}</td>
                    <td className="py-2 px-6">{`${Math.floor(
                      song.duration / 60
                    )}:${String(Math.round(song.duration % 60)).padStart(
                      2,
                      "0"
                    )}`}</td>
                    <td className="text-white ">
                      <span>
                        {currentSong === index
                          ? playing
                            ? "Playing..."
                            : "Paused..."
                          : ""}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
        <footer
          className={`fixed left-2 rounded-lg overflow-hidden bottom-2 z-40 w-[99%] ${
            currentSong === undefined && "hidden"
          }`}
        >
          <CustomAudioPlayer
            audioSrc={audio}
            isPlaying={playing}
            onPlayPause={() => setPlaying(!playing)}
            handlePlay={handlePlay}
            length={state.songs.length}
            index={currentSong}
          />
        </footer>
      </article>
    </section>
  );
};

export default AlbumDetails;
