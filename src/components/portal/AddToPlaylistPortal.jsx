import React, { useContext, useEffect, useState } from "react";
import { AuthContextAPI } from "../../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For generating unique playlist IDs
import { __DB } from "../../backend/firebase";
import toast from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications
import Spinner from "../helpers/Spinner";

const AddToPlaylistPortal = ({ close, id, poster }) => {
  console.log(id);
  const { authUser } = useContext(AuthContextAPI);
  const uid = authUser?.uid;
  const [playlists, setPlaylists] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch playlists from Firestore
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!uid) return;

      try {
        const userDocRef = doc(__DB, "user_profile", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setPlaylists(userData.playlists || []); // Ensure it's an array
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
      setLoading(false);
    };
    fetchPlaylists();
  }, [uid]);

  const createPlaylist = async () => {
    if (!playlistName.trim()) return;

    const newPlaylist = {
      id: uuidv4(), // Unique ID for each playlist
      name: playlistName.trim(),
      songs: [], // Initially empty
      poster: "", // Keep poster empty initially
    };

    try {
      const userDocRef = doc(__DB, "user_profile", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If playlists exist, update the array
        await updateDoc(userDocRef, {
          playlists: [...playlists, newPlaylist],
        });
      } else {
        // If user_profile doesn't exist, create a new document
        await setDoc(userDocRef, {
          playlists: [newPlaylist],
        });
      }

      setPlaylists(prev => [...prev, newPlaylist]); // Update local state
      setPlaylistName(""); // Clear input field
      setShowInput(false); // Hide input after creating
      toast.success("Playlist created!");
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  // Add song to an existing playlist
  const addSongToPlaylist = async playlistId => {
    const playlistToUpdate = playlists.find(
      playlist => playlist.id === playlistId
    );
    if (!playlistToUpdate) return; // Early exit if playlist is not found

    if (playlistToUpdate.songs?.includes(id)) {
      toast.error("Song already present in the playlist!");
      close(false);
      return;
    }

    // Check if this is the first song being added
    let updatedPoster = playlistToUpdate.poster;
    if (playlistToUpdate.songs.length === 0) {
      updatedPoster = poster; // Fetch the first song's thumbnail
    }

    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: [...playlist.songs, id], // Add song to playlist
          poster: updatedPoster, // Only update if it's the first song
        };
      }
      return playlist;
    });

    try {
      const userDocRef = doc(__DB, "user_profile", uid);
      await updateDoc(userDocRef, { playlists: updatedPlaylists });

      setPlaylists(updatedPlaylists);
      toast.success("Song added to playlist!");
      close(false);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  return (
    <section
      className="fixed inset-0 bg-black/60 flex justify-center items-center"
      onClick={e => {
        close(false), e.stopPropagation();
      }}
    >
      <article
        className="bg-slate-700 h-[50%] w-[30%] p-4 rounded-lg shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h1 className="text-center text-xl font-semibold">
              Add to Playlist
            </h1>
            <main className="mt-4 flex flex-col h-[84%] justify-between">
              <div>
                {playlists.length > 0 ? (
                  <h2 className="text-lg mb-2">Your Playlists</h2>
                ) : (
                  <h2 className="text-lg mb-2">No playlists available</h2>
                )}

                <ul className="text-white flex gap-4 mt-4">
                  {playlists.map(playlist => (
                    <li
                      key={playlist.id}
                      className="p-2 px-4 bg-slate-600 min-w-20 text-center rounded-md cursor-pointer"
                      onClick={() => addSongToPlaylist(playlist.id)} // Add song to playlist on click
                    >
                      {playlist.name}
                    </li>
                  ))}
                </ul>
              </div>

              {showInput && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={playlistName}
                    onChange={e => setPlaylistName(e.target.value)}
                    className="p-2 rounded-md bg-slate-600 text-white w-full"
                    placeholder="Enter playlist name"
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={createPlaylist}
                  >
                    Create
                  </button>
                </div>
              )}

              {!showInput && (
                <span
                  className="flex gap-2 items-center p-2 bg-slate-600 w-[180px] rounded-md self-end cursor-pointer"
                  onClick={() => setShowInput(true)}
                >
                  <FaPlus className="text-xl" /> Create Playlist
                </span>
              )}
            </main>
          </>
        )}
      </article>
    </section>
  );
};

export default AddToPlaylistPortal;
