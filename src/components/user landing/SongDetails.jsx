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
import { useNavigate } from "react-router-dom";

const SongDetails = ({
  allbumSong,
  index,
  songs,
  type,
  playlist,
  setPlaylist,
}) => {
  let { playing, handlePlay, song } = useContext(CustomAudioPlayerContextAPI);
  let { authUser } = useContext(AuthContextAPI);

  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [like, setLike] = useState(false);

  let navigate = useNavigate();

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
    if (authUser) {
      setPlaylistPortal(!playlistPortal);
    } else {
      toast.error("Login first");
      navigate("/auth/login");
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const handleDeleteFromPlaylist = e => {
    e.stopPropagation();
    setShowConfirm(true); // Show confirmation popup
  };

  const handleConfirmDelete = async e => {
    e.stopPropagation();

    try {
      const playlistRef = doc(__DB, "user_profile", authUser.uid);

      // 🔹 Fetch the current playlist document to avoid overwriting other properties
      const playlistSnap = await getDoc(playlistRef);
      if (!playlistSnap.exists()) return;

      const userData = playlistSnap.data();
      const updatedPlaylists = userData.playlists.map(pl =>
        pl.id === playlist.id
          ? {
              ...pl,
              songs: pl.songs.filter(songId => songId !== allbumSong.id),
            }
          : pl
      );

      // 🔹 Update only the modified playlist while keeping other properties intact
      await updateDoc(playlistRef, {
        playlists: updatedPlaylists,
      });

      setPlaylist(updatedPlaylists);

      toast.success(`${allbumSong.name} song deleted from playlist`);
    } catch (error) {
      console.error("Error removing song:", error);
    }

    setShowConfirm(false);
  };

  return (
    <>
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
            className="h-14 w-[100px] rounded-lg"
          />
        </td>
        <td className="py-2">{allbumSong.name}</td>
        <td className="py-2">{allbumSong.singers}</td>
        <td className="py-2 px-6">{allbumSong.musicDirector}</td>
        <td className="py-2 px-6">{`${Math.floor(
          allbumSong.duration / 60
        )}:${String(Math.round(allbumSong.duration % 60)).padStart(
          2,
          "0"
        )}`}</td>
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
        {type == "add" && (
          <>
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
                <AddToPlaylistPortal
                  close={setPlaylistPortal}
                  id={allbumSong.id}
                  poster={allbumSong.thumbnail}
                />,
                document.getElementById("portal")
              )}
          </>
        )}
        {type == "delete" && (
          <>
            <div
              className={`absolute right-12 -top-2 ${
                !showOptions && "hidden"
              } p-2 bg-white text-black rounded-md`}
              onClick={handleDeleteFromPlaylist}
            >
              Delete from playlist
            </div>
          </>
        )}
      </tr>
      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-slate-700">
            <h2 className="text-lg font-bold">Are you sure?</h2>
            <p>Do you really want to remove this song from the playlist?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={e => {
                  e.stopPropagation(), setShowConfirm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SongDetails;
