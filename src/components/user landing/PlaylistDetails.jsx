import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { __DB } from "../../backend/firebase";
import Spinner from "../helpers/Spinner";
import { CustomAudioPlayerContextAPI } from "../../context/CustomAudioPlayerContext";
import SongDetails from "./SongDetails";
import { AuthContextAPI } from "../../context/AuthContext";

const PlaylistDetails = () => {
  let { currentSong } = useContext(CustomAudioPlayerContextAPI);

  let { state } = useLocation();
  let [playlist, setPlaylist] = useState(state.playlist);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDuration, setTotalDuration] = useState();

  // Function to fetch songs based on song IDs
  const fetchSongs = async () => {
    try {
      const songCollectionRef = collection(__DB, "songs");
      const songQuery = query(
        songCollectionRef,
        where("__name__", "in", playlist.songs)
      );
      const songDocs = await getDocs(songQuery);

      const fetchedSongs = songDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSongs(fetchedSongs);

      // Calculate the total duration of the playlist
      const totalDuration = fetchedSongs.reduce(
        (sum, song) => sum + (song.duration || 0),
        0
      );
      setTotalDuration(totalDuration);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
    setLoading(false);
  };

  // Fetch playlist on component mount or when `id` changes
  useEffect(() => {
    console.log("hello")
    setLoading(true); // Start loading when the component is mounted
    fetchSongs();
  }, [playlist]);

  console.log(playlist);

  /// Function to format duration in MM:SS format
  const formatDuration = totalDuration => {
    const minutes = Math.floor(totalDuration / 60);
    const seconds = Math.floor(totalDuration % 60);
    const formattedDuration = `${String(minutes).padStart(
      2,
      "0"
    )} minutes : ${String(seconds).padStart(2, "0")} seconds`;
    return formattedDuration;
  };

  return (
    <section className="w-full md:w-[84%] bg-gray-900 px-6 py-8 h-[90.5vh] text-white">
      {loading ? (
        <div className="h-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : songs.length > 0 ? (
        <>
          <h1 className="text-4xl font-bold mb-6 text-center text-indigo-400">
            {playlist.name}
          </h1>

          {/* Playlist Information */}
          <div className="bg-gray-800 p-5 rounded-lg mb-6 shadow-lg flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">Playlist Summary</p>
              <p className="text-gray-300 mt-1">
                Total Tracks: <span className="font-bold">{songs.length}</span>
              </p>
              <p className="text-gray-300">
                Total Duration:{" "}
                <span className="font-bold">
                  {formatDuration(totalDuration)}
                </span>
              </p>
            </div>
            <div className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md text-lg">
              Enjoy your music! 🎵
            </div>
          </div>

          <main
            className={`mt-4 p-5 bg-gray-800 rounded-lg shadow-lg ${
              currentSong != null ? "mb-[180px]" : ""
            }`}
          >
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="uppercase bg-gray-700 text-indigo-300">
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
                {songs.map((allbumSong, index) => (
                  <SongDetails
                    allbumSong={allbumSong}
                    key={index}
                    index={index}
                    songs={songs}
                    type="delete"
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                  />
                ))}
              </tbody>
            </table>
          </main>
        </>
      ) : (
        <p className="text-gray-400 text-lg text-center">
          No songs found in this playlist.
        </p>
      )}
    </section>
  );
};

export default PlaylistDetails;
