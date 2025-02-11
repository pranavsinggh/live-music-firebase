import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AlbumDetail from "./AlbumDetail";
import { AuthContextAPI } from "../../context/AuthContext";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { __DB } from "../../backend/firebase";
import toast from "react-hot-toast";
import SongDetails from "./SongDetails";
import { FaHeart } from "react-icons/fa";

const AlbumDetails = () => {
  let { state } = useLocation();
  let { authUser } = useContext(AuthContextAPI);
  let { currentSong } = useContext(CustomAudioPlayerContextAPI);

  let [musicDirector, setMusicDirector] = useState("");
  let [lyricist, setLyricist] = useState("");
  let [actors, setActors] = useState("");
  let [singers, setSingers] = useState("");
  let [director, setDirector] = useState("");

  const [favouriteAlbums, setFavouriteAlbums] = useState([]);
  const [like, setLike] = useState(false);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!authUser?.uid) return;

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const favourites = userDocSnap.data().favouriteAlbum || [];
        setFavouriteAlbums(favourites);
        setLike(favourites.includes(state.id)); // Update like state
      }
    };

    fetchFavourites();
  }, [authUser?.uid, state.id]); // Runs when authUser or album ID changes

  let handleFavourite = async () => {
    try {
      if (!authUser?.uid) {
        toast.error("User not authenticated");
        return;
      }

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const isAlreadyFavourite = favouriteAlbums.includes(state.id);

      await updateDoc(userDocRef, {
        favouriteAlbum: isAlreadyFavourite
          ? arrayRemove(state.id)
          : arrayUnion(state.id),
      });

      // Update state instantly to avoid refetching
      const updatedFavourites = isAlreadyFavourite
        ? favouriteAlbums.filter(id => id !== state.id) // Remove
        : [...favouriteAlbums, state.id]; // Add

      setFavouriteAlbums(updatedFavourites);
      setLike(!isAlreadyFavourite);

      toast.success(
        isAlreadyFavourite
          ? "Album removed from favourites"
          : "Album added to favourites"
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (state?.songs) {
      let newMusicDirectors = new Set();
      let newDirectors = new Set();
      let newLyricists = new Set();
      let newActors = new Set();
      let newSingers = new Set();

      state?.songs.forEach(song => {
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
    // setSongs(state.songs);
  }, [state]);

  // const handlePlayAfterSetSongs = index => {
  //   setSongs(state.songs);

  //   setTimeout(() => {
  //     handlePlay(index);
  //   }, 0);
  // };

  return (
    <section className="p-3 w-[85%]">
      <article>
        <aside className="flex gap-10 ">
          <div className="basis-[30%]">
            <figure className="py-3 relative">
              <img src={state?.poster} alt="" className="rounded-lg w-full " />
              <span className="absolute top-0 right-0 px-3 py-1 bg-pink-500 rounded-md text-[12px]">
                {state.language}
              </span>
              <span
                className={`absolute -right-2 bottom-2 text-2xl  cursor-pointer`}
                onClick={() => {
                  setLike(!like), handleFavourite();
                }}
              >
                <FaHeart className={`${like && "text-pink-500"}`} />
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
        <main
          className={`mt-4 p-5 flex flex-col gap-4 bg-slate-900 rounded-lg ${
            currentSong != null ? "mb-[180px]" : ""
          }`}
        >
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="uppercase bg-slate-600 text-white w-full ">
              <tr>
                <th className="px-4 py-3"></th>
                <th className="px-6 py-3">Track</th>
                <th className="px-6 py-3">Song Name</th>
                <th className="px-6 py-3">Artists</th>
                <th className="px-6 py-3">Music Director</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Favourite</th>
                <th className="px-6 py-3 w-[70px]"></th>
              </tr>
            </thead>
            <tbody>
              {state?.songs.map((allbumSong, index) => {
                return (
                  <SongDetails
                    allbumSong={allbumSong}
                    key={index}
                    index={index}
                    state={state}
                  />
                );
              })}
            </tbody>
          </table>
        </main>
      </article>
    </section>
  );
};

export default AlbumDetails;
