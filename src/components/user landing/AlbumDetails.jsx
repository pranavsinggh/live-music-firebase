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
import { AudioContext } from "../../context/AudioContextApi";

const AlbumDetails = () => {
  let {
    state: { album },
  } = useLocation();

  let { authUser } = useContext(AuthContextAPI);
  let { allSongs } = useContext(AudioContext);
  let { currentSong } = useContext(CustomAudioPlayerContextAPI);

  let [songs, setSongs] = useState([]);

  const fetchAlbumWithSongs = async () => {
    try {
      const songIds = album.songs; // Array of song IDs

      if (!songIds || songIds.length === 0) {
        setSongs([]);
      }

      const filteredSongs = allSongs.filter(song =>
        album?.songs.includes(song.id)
      );
      setSongs(filteredSongs);
    } catch (error) {
      console.error("Error fetching album with songs:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchAlbumWithSongs();
  }, [allSongs]);

  const [data, setData] = useState({
    language: [],
    musicDirectors: [],
    singers: [],
    duration: "00:00", // Initialize duration as a string
  });

  useEffect(() => {
    if (!songs || songs.length === 0) return; // Ensure songs exist before processing

    const languages = new Set();
    const musicDirectors = new Set();
    const singers = new Set();
    let totalDuration = 0;

    songs.forEach(song => {
      if (song.language) {
        song.language
          .split(", ")
          .forEach(language => languages.add(language.trim())); // Handle multiple singers
      }
      if (song.musicDirector) {
        song.musicDirector
          .split(", ")
          .forEach(musicDirector => musicDirectors.add(musicDirector.trim())); // Handle multiple singers
      }
      if (song.singers) {
        song.singers.split(", ").forEach(singer => singers.add(singer.trim())); // Handle multiple singers
      }
      totalDuration += song.duration || 0; // Sum up duration in seconds
    });

    // Convert total duration from seconds to MM:SS format
    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);
    const formattedDuration = `${String(minutes).padStart(
      2,
      "0"
    )} minutes : ${String(seconds).padStart(2, "0")} seconds`;

    setData({
      language: [...languages],
      musicDirectors: [...musicDirectors],
      singers: [...singers],
      duration: formattedDuration, // Store formatted duration
    });
  }, [songs]); // Runs whenever songs change

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
        setLike(favourites.includes(album.id)); // Update like state
      }
    };

    fetchFavourites();
  }, [authUser?.uid, album.id]); // Runs when authUser or album ID changes

  let handleFavourite = async () => {
    try {
      if (!authUser?.uid) {
        toast.error("User not authenticated");
        return;
      }

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const isAlreadyFavourite = favouriteAlbums.includes(album.id);

      await updateDoc(userDocRef, {
        favouriteAlbum: isAlreadyFavourite
          ? arrayRemove(album.id)
          : arrayUnion(album.id),
      });

      // Update state instantly to avoid refetching
      const updatedFavourites = isAlreadyFavourite
        ? favouriteAlbums.filter(id => id !== album.id) // Remove
        : [...favouriteAlbums, album.id]; // Add

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

  return (
    <section className="p-3 w-[85%]">
      <article>
        <aside className="flex gap-10 ">
          <div className="basis-[30%]">
            <figure className="py-3 relative">
              <img src={album?.poster} alt="" className="rounded-lg w-full " />
              <span className="absolute top-0 right-0 px-3 py-1 bg-pink-500 rounded-md text-[12px]">
                {data?.language.join()}
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
              <span>{album?.title}</span>
              <span className="text-right mx-10 font-thin text-[13px] bg-purple-700 text-white rounded-lg px-2 py-1">
                Number of tracks{" "}
                <span className="text-[14px] px-2 font-bold">
                  {songs?.length}
                </span>
              </span>
            </h1>
            <ul className="flex flex-col py-[10px] leading-9">
              <AlbumDetail field="Title" data={album?.title} />
              <AlbumDetail field="Director" data={album?.director} />
              <AlbumDetail field="Artist" data={album?.artist} />
              <AlbumDetail field="Release data" data={album?.date} />
              <AlbumDetail field="Singers" data={data?.singers.join()} />
              <AlbumDetail field="Language" data={data?.language.join()} />
              <AlbumDetail
                field="Music directors"
                data={data?.musicDirectors.join()}
              />
              <AlbumDetail field="Duration" data={data?.duration} />
              <AlbumDetail field="Description" data={album?.description} />
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
                <th className="px-6 py-3">Singers</th>
                <th className="px-6 py-3">Music Director</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3 w-[60px]">Favourite</th>
                <th className="px-6 py-3 w-[70px]"></th>
                <th className="px-6 py-3 w-[30px]"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((allbumSong, index) => {
                return (
                  <SongDetails
                    allbumSong={allbumSong}
                    key={index}
                    index={index}
                    songs={songs}
                    type="add"
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
