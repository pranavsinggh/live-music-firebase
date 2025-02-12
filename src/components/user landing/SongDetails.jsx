import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaPause, FaPlay } from "react-icons/fa";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import { AuthContextAPI } from "../../context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { __DB } from "../../backend/firebase";
import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactDOM from "react-dom";
import AddToPlaylistPortal from "../portal/AddToPlaylistPortal";

const SongDetails = ({ allbumSong, index, songs }) => {
  let { playing, handlePlay, song } = useContext(CustomAudioPlayerContextAPI);
  let { authUser } = useContext(AuthContextAPI);

  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [like, setLike] = useState(false);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!authUser?.uid) return;

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const favourites = userDocSnap.data().favouriteSong || [];
        setFavouriteSongs(favourites);
        setLike(favourites.includes(allbumSong.id)); // Update like state
      }
    };

    fetchFavourites();
  }, [authUser?.uid, allbumSong.id]); // Runs when authUser or album ID changes

  let handleFavourite = async () => {
    try {
      if (!authUser?.uid) {
        toast.error("User not authenticated");
        return;
      }

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const isAlreadyFavourite = favouriteSongs.includes(allbumSong.id);

      await updateDoc(userDocRef, {
        favouriteSong: isAlreadyFavourite
          ? arrayRemove(allbumSong.id)
          : arrayUnion(allbumSong.id),
      });

      // Update state instantly to avoid refetching
      const updatedFavourites = isAlreadyFavourite
        ? favouriteSongs.filter(id => id !== allbumSong.id) // Remove
        : [...favouriteSongs, allbumSong.id]; // Add

      setFavouriteSongs(updatedFavourites);
      setLike(!isAlreadyFavourite);

      toast.success(
        isAlreadyFavourite
          ? "Song removed from favourites"
          : "Song added to favourites"
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  let [showOptions, setShowOptions] = useState(false);
  let handleOptions = e => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  let [playlistPortal, setPlaylistPortal] = useState(false);
  let handleAddToPlaylist = e => {
    e.stopPropagation();
    setPlaylistPortal(!playlistPortal);
  };
  return (
    <tr
      className={`border-b border-slate-400  text-slate-400 transition-all cursor-pointer ${
        allbumSong === song && "bg-purple-900 text-white"
      }  ${
        authUser === null &&
        index > 1 &&
        "bg-[#62676A] text-black cursor-not-allowed"
      } relative`}
      onClick={() => handlePlay(index, songs, "album")}
    >
      <td className="py-2">
        <div className="flex justify-center items-center">{index + 1}</div>
      </td>
      <td className="relative  py-2">
        <span className="absolute top-7 text-white  left-11">
          {allbumSong === song && playing ? <FaPause /> : <FaPlay />}
        </span>
        <img
          src={allbumSong.thumbnail}
          alt=""
          className="h-14 w-18 rounded-lg"
        />
      </td>
      <td className="py-2">{allbumSong.name}</td>
      <td className="py-2">{allbumSong.singers}</td>
      <td className="py-2 px-6">{allbumSong.musicDirector}</td>
      <td className="py-2 px-6">{`${Math.floor(
        allbumSong.duration / 60
      )}:${String(Math.round(allbumSong.duration % 60)).padStart(2, "0")}`}</td>
      <td className="py-2 px-12">
        <span
          className={`text-2xl  cursor-pointer`}
          onClick={e => {
            e.stopPropagation(); // Prevent triggering row click
            setLike(!like);
            handleFavourite();
          }}
        >
          <FaHeart className={`${like && "text-pink-500"}`} />
        </span>
      </td>
      <td className="text-white ">
        <span>
          {allbumSong === song ? (playing ? "Playing..." : "Paused...") : ""}
        </span>
      </td>
      <td>
        <span className="text-xl" onClick={handleOptions}>
          <BsThreeDotsVertical />
        </span>
      </td>
      <div
        className={`absolute right-12 -top-2 ${
          !showOptions && "hidden"
        } p-2 bg-white text-black rounded-md`}
        onClick={handleAddToPlaylist}
      >
        Add to playlist
      </div>
      {playlistPortal &&
        ReactDOM.createPortal(
          <AddToPlaylistPortal close={setPlaylistPortal} id={allbumSong.id} />,
          document.getElementById("portal")
        )}
    </tr>
  );
};

export default SongDetails;
