import React, { useContext, useEffect, useState } from "react";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddToPlaylistPortal from "../portal/AddToPlaylistPortal";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { AuthContextAPI } from "../../context/AuthContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { __DB } from "../../backend/firebase";
import toast from "react-hot-toast";

const SingleSong = ({ song, index, songs }) => {
  let { handlePlay } = useContext(CustomAudioPlayerContextAPI);
  let { authUser } = useContext(AuthContextAPI);
  let navigate = useNavigate();

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
        setLike(favourites.includes(song.id)); // Update like state
      }
    };

    fetchFavourites();
  }, [authUser?.uid, song.id]); // Runs when authUser or album ID changes

  let handleFavourite = async (e) => {
    e.stopPropagation()
    try {
      if (!authUser?.uid) {
        toast.error("User not authenticated");
        return;
      }

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const isAlreadyFavourite = favouriteSongs.includes(song.id);

      await updateDoc(userDocRef, {
        favouriteSong: isAlreadyFavourite
          ? arrayRemove(song.id)
          : arrayUnion(song.id),
      });

      // Update state instantly to avoid refetching
      const updatedFavourites = isAlreadyFavourite
        ? favouriteSongs.filter(id => id !== song.id) // Remove
        : [...favouriteSongs, song.id]; // Add

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
  return (
    <div
      className="basis-[200px] mt-2 bg-slate-900 rounded-md hover:scale-105 transition-all"
      onClick={() => handlePlay(index, songs, "song")}
    >
      <figure>
        <img
          src={song.thumbnail}
          alt=""
          className="h-[120px] w-full rounded-t-md object-cover"
        />
      </figure>
      <main className="py-2 px-2 text-sm flex justify-between relative">
        <h1>
          {song?.name?.length > 15 ? song.name.slice(0, 15) + "..." : song.name}
        </h1>
        <span className="text-xl cursor-pointer" onClick={handleOptions}>
          <BsThreeDotsVertical />
        </span>
        <div
          className={`absolute right-3 top-8 ${
            !showOptions && "hidden"
          } p-2 bg-white text-black rounded-md  flex flex-col`}
        >
          <span onClick={handleAddToPlaylist} className="cursor-pointer">Add to playlist</span>
          <hr className="border-2 border-black/50" />
          <span className="cursor-pointer" onClick={handleFavourite}>
            {like ? "Remove from favourites" : "Add to favourites"}
          </span>
        </div>
        {playlistPortal &&
          ReactDOM.createPortal(
            <AddToPlaylistPortal close={setPlaylistPortal} id={song.id} />,
            document.getElementById("portal")
          )}
      </main>
    </div>
  );
};

export default SingleSong;
